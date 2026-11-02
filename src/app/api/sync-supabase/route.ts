import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/client";
import { Pandal, Locality, Place } from "@/types";
import { randomUUID } from "crypto";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "CDN-Cache-Control": "no-store",
  "Netlify-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

function isUuid(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

const SQL_FIX_COMMAND = `GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;`;

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const [pandalsRes, localitiesRes, placesRes] = await Promise.all([
      supabase
        .from("pandals")
        .select("*, locality:localities(*)")
        .order("name", { ascending: true }),
      supabase
        .from("localities")
        .select("*")
        .order("name", { ascending: true }),
      supabase
        .from("places")
        .select("*")
        .order("name", { ascending: true }),
    ]);

    if (pandalsRes.error) {
      console.error("[Supabase GET Error]:", pandalsRes.error);
      const isPermission =
        pandalsRes.error.code === "42501" ||
        pandalsRes.error.message?.toLowerCase().includes("permission denied");

      return NextResponse.json({
        success: false,
        error: isPermission
          ? "Database permissions need configuration in Supabase."
          : "Unable to retrieve pandals from cloud database. Local cache active.",
        technical_details: pandalsRes.error.message,
        is_permission_error: isPermission,
        sql_fix: isPermission ? SQL_FIX_COMMAND : undefined,
      });
    }

    return NextResponse.json(
      {
        success: true,
        pandals: pandalsRes.data || [],
        localities: localitiesRes.data || [],
        places: placesRes.data || [],
        count: pandalsRes.data?.length || 0,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || "Internal server error connecting to Supabase",
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const type = searchParams.get("type") || "pandal";

    if (!id && !slug) {
      return NextResponse.json(
        { success: false, error: "Missing id or slug parameter" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const table = type === "place" ? "places" : "pandals";

    let deleted = false;
    // 1. Try deleting by valid UUID if id is a uuid
    if (id && isUuid(id)) {
      const { error: uuidErr } = await supabase.from(table).delete().eq("id", id);
      if (!uuidErr) deleted = true;
    }

    // 2. Try deleting by slug
    const targetSlug = slug || (id && !isUuid(id) ? id.replace(/^(pandal|place|loc)-/, "") : null);
    if (targetSlug) {
      const { error: slugErr } = await supabase.from(table).delete().eq("slug", targetSlug);
      if (!slugErr) deleted = true;
    }

    // 3. For places without slug, try deleting by name
    if (type === "place" && !deleted && id) {
      await supabase.from(table).delete().eq("name", id);
    }

    return NextResponse.json({ success: true, id, slug });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Delete failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pandals, localities, places } = body as {
      pandals?: Pandal[];
      localities?: Locality[];
      places?: Place[];
    };

    const supabase = getServiceSupabase();

    // 1. Fetch existing localities to preserve their UUIDs
    const { data: dbLocs } = await supabase
      .from("localities")
      .select("id, slug");
    const locMap = new Map<string, string>();
    if (dbLocs) {
      dbLocs.forEach((l) => locMap.set(l.slug, l.id));
    }

    // Upsert localities
    if (localities && localities.length > 0) {
      const formattedLocalities = localities.map((loc) => {
        const id =
          locMap.get(loc.slug) ||
          (isUuid(loc.id) ? loc.id : randomUUID());
        locMap.set(loc.slug, id);
        return {
          id,
          name: loc.name,
          name_bn: loc.name_bn,
          slug: loc.slug,
          description: loc.description || null,
        };
      });

      const { error: locError } = await supabase
        .from("localities")
        .upsert(formattedLocalities, { onConflict: "slug" });

      if (locError) {
        console.error("[Supabase Localities Upsert Error]:", locError);
        const isPermission = locError.code === "42501";
        return NextResponse.json({
          success: false,
          error: isPermission
            ? "Table permissions need configuration in Supabase."
            : "Could not synchronize localities with cloud database.",
          technical_details: locError.message,
          is_permission_error: isPermission,
          sql_fix: isPermission ? SQL_FIX_COMMAND : undefined,
        });
      }
    }

    // 2. Upsert pandals
    if (pandals && pandals.length > 0) {
      const { data: dbPandals } = await supabase
        .from("pandals")
        .select("id, slug");
      const pandalMap = new Map<string, string>();
      if (dbPandals) {
        dbPandals.forEach((p) => pandalMap.set(p.slug, p.id));
      }

      const formattedPandals = pandals.map((p) => {
        const localitySlug =
          typeof p.locality === "object" && p.locality
            ? p.locality.slug
            : p.locality_id?.replace("loc-", "");

        const resolvedLocalityId = localitySlug
          ? locMap.get(localitySlug) || null
          : null;

        const id =
          pandalMap.get(p.slug) ||
          (isUuid(p.id) ? p.id : randomUUID());

        return {
          id,
          name: p.name,
          name_bn: p.name_bn || p.name,
          slug: p.slug,
          description: p.description || "",
          description_bn: p.description_bn || null,
          address: p.address,
          address_bn: p.address_bn || null,
          locality_id: resolvedLocalityId,
          latitude: typeof p.latitude === "number" ? p.latitude : null,
          longitude: typeof p.longitude === "number" ? p.longitude : null,
          cover_image_url: p.cover_image_url,
          gallery: p.gallery || [],
          category: p.category || "traditional",
          darshan_start: p.darshan_start || null,
          darshan_end: p.darshan_end || null,
          timings_verified_at: p.timings_verified_at || null,
          is_published: p.is_published ?? true,
          is_verified: p.is_verified ?? false,
          verified_at: p.verified_at || null,
          is_featured: p.is_featured ?? false,
          accessibility: p.accessibility || { wheelchair_accessible: false },
          committee_contact: p.committee_contact || null,
          updated_at: new Date().toISOString(),
        };
      });

      const { error: pandalError } = await supabase
        .from("pandals")
        .upsert(formattedPandals, { onConflict: "slug" });

      if (pandalError) {
        console.error("[Supabase Pandals Upsert Error]:", pandalError);
        const isPermission =
          pandalError.code === "42501" ||
          pandalError.message?.toLowerCase().includes("permission denied");

        return NextResponse.json({
          success: false,
          error: isPermission
            ? "Table permissions need configuration in Supabase."
            : "Could not synchronize pandals with cloud database. Local changes remain safe.",
          technical_details: pandalError.message,
          is_permission_error: isPermission,
          sql_fix: isPermission ? SQL_FIX_COMMAND : undefined,
        });
      }
    }

    // 3. Upsert places (sweet shops, parking, first aid)
    if (places && places.length > 0) {
      const { data: dbPlaces } = await supabase
        .from("places")
        .select("id, name");
      const placeMap = new Map<string, string>();
      if (dbPlaces) {
        dbPlaces.forEach((pl) => placeMap.set(pl.name, pl.id));
      }

      const formattedPlaces = places.map((pl) => {
        const id =
          placeMap.get(pl.name) ||
          (isUuid(pl.id) ? pl.id : randomUUID());

        return {
          id,
          name: pl.name,
          name_bn: pl.name_bn || pl.name,
          category: pl.category,
          description: pl.description || "",
          description_bn: pl.description_bn || null,
          address: pl.address,
          address_bn: pl.address_bn || null,
          latitude: pl.latitude,
          longitude: pl.longitude,
          opening_hours: pl.opening_hours ? { hours: pl.opening_hours } : null,
          is_published: pl.is_published ?? true,
          is_verified: pl.is_verified ?? true,
          updated_at: new Date().toISOString(),
        };
      });

      await supabase.from("places").upsert(formattedPlaces);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${pandals?.length || 0} pandals, coordinates and localities to Supabase Cloud!`,
      synced_at: new Date().toISOString(),
      count: pandals?.length || 0,
    });
  } catch (err: any) {
    console.error("[Supabase Sync Fatal Error]:", err);
    return NextResponse.json({
      success: false,
      error: "Unable to complete cloud database synchronization.",
      technical_details: err?.message,
    });
  }
}
