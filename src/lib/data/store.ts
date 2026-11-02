import {
  Pandal,
  Locality,
  Place,
  Announcement,
  Submission,
  SubmissionStatus,
} from "@/types";
import {
  SEED_PANDALS,
  SEED_LOCALITIES,
  SEED_PLACES,
  SEED_ANNOUNCEMENTS,
} from "./seed-data";

const STORAGE_KEYS = {
  PANDALS: "jd_pandals_v2",
  LOCALITIES: "jd_localities_v2",
  PLACES: "jd_places_v2",
  ANNOUNCEMENTS: "jd_announcements_v1",
  SUBMISSIONS: "jd_submissions_v1",
};

// Safe browser local storage helper
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("LocalStorage save error:", err);
  }
}

// In-memory fallback for SSR
let memoryPandals = [...SEED_PANDALS];
let memoryLocalities = [...SEED_LOCALITIES];
let memoryPlaces = [...SEED_PLACES];
let memoryAnnouncements = [...SEED_ANNOUNCEMENTS];
let memorySubmissions: Submission[] = [
  {
    id: "sub-1",
    submission_type: "correction",
    pandal_id: "pandal-chasapara-buri-maa",
    pandal_name: "Chasapara Buri Maa",
    submitted_data: {
      reporter_name: "Sourav Ganguly (Volunteer)",
      reporter_contact: "sourav@example.com",
      description: "Added confirmed timings for evening bhog arati at 8:00 PM.",
      source_reference: "Chasapara Committee Notice Board",
    },
    status: "pending",
    created_at: new Date().toISOString(),
  },
];

export const dataStore = {
  // PANDALS
  getPandals(options?: {
    localityId?: string;
    category?: string;
    verifiedOnly?: boolean;
    search?: string;
    includeUnpublished?: boolean;
  }): Pandal[] {
    const all = getStored<Pandal[]>(STORAGE_KEYS.PANDALS, memoryPandals);
    
    // Deduplicate by slug or ID to prevent phantom duplicates
    const seenSlugs = new Set<string>();
    const deduplicated = all.filter((p) => {
      const key = (p.slug || p.id || "").toLowerCase().trim();
      if (!key || seenSlugs.has(key)) return false;
      seenSlugs.add(key);
      return true;
    });

    let filtered = deduplicated.filter((p) => options?.includeUnpublished || p.is_published);

    if (options?.localityId && options.localityId !== "all") {
      filtered = filtered.filter((p) => p.locality_id === options.localityId);
    }
    if (options?.category && options.category !== "all") {
      filtered = filtered.filter((p) => p.category === options.category);
    }
    if (options?.verifiedOnly) {
      filtered = filtered.filter((p) => p.is_verified);
    }
    if (options?.search) {
      const q = options.search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.name_bn && p.name_bn.toLowerCase().includes(q)) ||
          p.address.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.locality && p.locality.name.toLowerCase().includes(q))
      );
    }

    return filtered;
  },

  getPandalBySlug(slug: string): Pandal | undefined {
    const all = getStored<Pandal[]>(STORAGE_KEYS.PANDALS, memoryPandals);
    return all.find((p) => p.slug === slug || p.id === slug);
  },

  getPandalById(id: string): Pandal | undefined {
    const all = getStored<Pandal[]>(STORAGE_KEYS.PANDALS, memoryPandals);
    return all.find((p) => p.id === id);
  },

  savePandal(pandal: Partial<Pandal> & { name: string }): Pandal {
    const all = getStored<Pandal[]>(STORAGE_KEYS.PANDALS, memoryPandals);
    const existingIndex = all.findIndex((p) => p.id === pandal.id);

    const slug =
      pandal.slug ||
      pandal.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const resolvedLocality = pandal.locality_id
      ? dataStore.getLocalities().find((l) => l.id === pandal.locality_id)
      : null;

    if (existingIndex >= 0) {
      const updated: Pandal = {
        ...all[existingIndex],
        ...pandal,
        slug,
        locality: resolvedLocality || all[existingIndex].locality,
        updated_at: new Date().toISOString(),
      };
      all[existingIndex] = updated;
      setStored(STORAGE_KEYS.PANDALS, all);
      memoryPandals = all;
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("jd_data_updated", { detail: { type: "pandal" } })
        );
      }
      return updated;
    } else {
      const newPandal: Pandal = {
        id: pandal.id || `pandal-${Date.now()}`,
        name: pandal.name,
        name_bn: pandal.name_bn || pandal.name,
        slug,
        description: pandal.description || "",
        description_bn: pandal.description_bn || "",
        address: pandal.address || "Krishnanagar, Nadia",
        address_bn: pandal.address_bn || "কৃষ্ণনগর, নদিয়া",
        locality_id: pandal.locality_id || null,
        locality: resolvedLocality || null,
        latitude: pandal.latitude ?? null,
        longitude: pandal.longitude ?? null,
        cover_image_url:
          pandal.cover_image_url ||
          "https://upload.wikimedia.org/wikipedia/commons/2/2a/Burima%2C_Krishnanagar.jpg",
        gallery: pandal.gallery || [],
        category: pandal.category || "traditional",
        darshan_start: pandal.darshan_start || null,
        darshan_end: pandal.darshan_end || null,
        timings_verified_at: pandal.timings_verified_at || null,
        is_published: pandal.is_published ?? true,
        is_verified: pandal.is_verified ?? false,
        verified_at: pandal.verified_at || null,
        is_featured: pandal.is_featured ?? false,
        accessibility: pandal.accessibility || { wheelchair_accessible: false },
        committee_contact: pandal.committee_contact || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updatedList = [newPandal, ...all];
      setStored(STORAGE_KEYS.PANDALS, updatedList);
      memoryPandals = updatedList;
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("jd_data_updated", { detail: { type: "pandal" } })
        );
      }
      return newPandal;
    }
  },

  deletePandal(id: string): void {
    const all = getStored<Pandal[]>(STORAGE_KEYS.PANDALS, memoryPandals);
    const filtered = all.filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PANDALS, filtered);
    memoryPandals = filtered;
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("jd_data_updated", { detail: { type: "pandal" } })
      );
    }
  },

  // LOCALITIES
  getLocalities(): Locality[] {
    return getStored<Locality[]>(STORAGE_KEYS.LOCALITIES, memoryLocalities);
  },

  saveLocality(locality: Partial<Locality> & { name: string; name_bn: string }): Locality {
    const all = getStored<Locality[]>(STORAGE_KEYS.LOCALITIES, memoryLocalities);
    const existingIndex = all.findIndex((l) => l.id === locality.id);
    const slug =
      locality.slug ||
      locality.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    if (existingIndex >= 0) {
      const updated: Locality = { ...all[existingIndex], ...locality, slug };
      all[existingIndex] = updated;
      setStored(STORAGE_KEYS.LOCALITIES, all);
      memoryLocalities = all;
      return updated;
    } else {
      const newLoc: Locality = {
        id: locality.id || `loc-${Date.now()}`,
        name: locality.name,
        name_bn: locality.name_bn,
        slug,
        description: locality.description || null,
      };
      const updatedList = [...all, newLoc];
      setStored(STORAGE_KEYS.LOCALITIES, updatedList);
      memoryLocalities = updatedList;
      return newLoc;
    }
  },

  deleteLocality(id: string): void {
    const all = getStored<Locality[]>(STORAGE_KEYS.LOCALITIES, memoryLocalities);
    const filtered = all.filter((l) => l.id !== id);
    setStored(STORAGE_KEYS.LOCALITIES, filtered);
    memoryLocalities = filtered;
  },

  // PLACES
  getPlaces(options?: { category?: string; search?: string }): Place[] {
    const all = getStored<Place[]>(STORAGE_KEYS.PLACES, memoryPlaces);
    let filtered = all.filter((p) => p.is_published);

    if (options?.category && options.category !== "all") {
      filtered = filtered.filter((p) => p.category === options.category);
    }
    if (options?.search) {
      const q = options.search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.name_bn && p.name_bn.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    return filtered;
  },

  savePlace(place: Partial<Place> & { name: string; latitude: number; longitude: number }): Place {
    const all = getStored<Place[]>(STORAGE_KEYS.PLACES, memoryPlaces);
    const existingIndex = all.findIndex((p) => p.id === place.id);

    if (existingIndex >= 0) {
      const updated: Place = {
        ...all[existingIndex],
        ...place,
        updated_at: new Date().toISOString(),
      };
      all[existingIndex] = updated;
      setStored(STORAGE_KEYS.PLACES, all);
      memoryPlaces = all;
      return updated;
    } else {
      const newPlace: Place = {
        id: place.id || `place-${Date.now()}`,
        name: place.name,
        name_bn: place.name_bn || place.name,
        category: place.category || "sweet_shop",
        description: place.description || "",
        description_bn: place.description_bn || "",
        address: place.address || "Krishnanagar, Nadia",
        address_bn: place.address_bn || "কৃষ্ণনগর, নদিয়া",
        latitude: place.latitude,
        longitude: place.longitude,
        opening_hours: place.opening_hours || null,
        is_published: place.is_published ?? true,
        is_verified: place.is_verified ?? true,
        updated_at: new Date().toISOString(),
      };
      const updatedList = [newPlace, ...all];
      setStored(STORAGE_KEYS.PLACES, updatedList);
      memoryPlaces = updatedList;
      return newPlace;
    }
  },

  deletePlace(id: string): void {
    const all = getStored<Place[]>(STORAGE_KEYS.PLACES, memoryPlaces);
    const filtered = all.filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PLACES, filtered);
    memoryPlaces = filtered;
  },

  // ANNOUNCEMENTS
  getAnnouncements(): Announcement[] {
    const all = getStored<Announcement[]>(
      STORAGE_KEYS.ANNOUNCEMENTS,
      memoryAnnouncements
    );
    return all.filter((a) => a.is_published);
  },

  saveAnnouncement(announcement: Partial<Announcement> & { title: string; body: string }): Announcement {
    const all = getStored<Announcement[]>(
      STORAGE_KEYS.ANNOUNCEMENTS,
      memoryAnnouncements
    );
    const existingIndex = all.findIndex((a) => a.id === announcement.id);

    if (existingIndex >= 0) {
      const updated: Announcement = {
        ...all[existingIndex],
        ...announcement,
      };
      all[existingIndex] = updated;
      setStored(STORAGE_KEYS.ANNOUNCEMENTS, all);
      memoryAnnouncements = all;
      return updated;
    } else {
      const newAnn: Announcement = {
        id: announcement.id || `ann-${Date.now()}`,
        title: announcement.title,
        title_bn: announcement.title_bn || announcement.title,
        body: announcement.body,
        body_bn: announcement.body_bn || announcement.body,
        severity: announcement.severity || "info",
        published_at: new Date().toISOString(),
        expires_at: announcement.expires_at || null,
        is_published: announcement.is_published ?? true,
      };
      const updatedList = [newAnn, ...all];
      setStored(STORAGE_KEYS.ANNOUNCEMENTS, updatedList);
      memoryAnnouncements = updatedList;
      return newAnn;
    }
  },

  deleteAnnouncement(id: string): void {
    const all = getStored<Announcement[]>(
      STORAGE_KEYS.ANNOUNCEMENTS,
      memoryAnnouncements
    );
    const filtered = all.filter((a) => a.id !== id);
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, filtered);
    memoryAnnouncements = filtered;
  },

  // SUBMISSIONS (Community Corrections)
  getSubmissions(): Submission[] {
    return getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, memorySubmissions);
  },

  addSubmission(sub: Omit<Submission, "id" | "status" | "created_at">): Submission {
    const all = getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, memorySubmissions);
    const newSubmission: Submission = {
      ...sub,
      id: `sub-${Date.now()}`,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    const updated = [newSubmission, ...all];
    setStored(STORAGE_KEYS.SUBMISSIONS, updated);
    memorySubmissions = updated;
    return newSubmission;
  },

  updateSubmissionStatus(id: string, status: SubmissionStatus): void {
    const all = getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, memorySubmissions);
    const target = all.find((s) => s.id === id);
    if (target) {
      target.status = status;
      setStored(STORAGE_KEYS.SUBMISSIONS, all);
      memorySubmissions = all;
    }
  },

  // SUPABASE CLOUD SYNCHRONIZATION
  async syncToCloud(): Promise<{
    success: boolean;
    error?: string;
    is_permission_error?: boolean;
    sql_fix?: string;
    count?: number;
  }> {
    try {
      const pandals = this.getPandals({ includeUnpublished: true });
      const localities = this.getLocalities();
      const places = this.getPlaces();

      const res = await fetch("/api/sync-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pandals, localities, places }),
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Network error while connecting to Supabase",
      };
    }
  },

  async fetchFromCloud(): Promise<{
    success: boolean;
    error?: string;
    is_permission_error?: boolean;
    sql_fix?: string;
    count?: number;
    pandals?: Pandal[];
  }> {
    try {
      const res = await fetch(`/api/sync-supabase?_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      const json = await res.json();
      if (
        json.success &&
        Array.isArray(json.pandals) &&
        json.pandals.length > 0
      ) {
        setStored(STORAGE_KEYS.PANDALS, json.pandals);
        memoryPandals = json.pandals;

        if (Array.isArray(json.localities) && json.localities.length > 0) {
          setStored(STORAGE_KEYS.LOCALITIES, json.localities);
          memoryLocalities = json.localities;
        }

        if (Array.isArray(json.places) && json.places.length > 0) {
          setStored(STORAGE_KEYS.PLACES, json.places);
          memoryPlaces = json.places;
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("jd_data_updated", { detail: { type: "cloud_sync" } })
          );
        }
      }
      return json;
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to fetch data from Supabase",
      };
    }
  },

  // RESET ALL DATA TO FRESH SEED
  resetToSeed(): void {
    setStored(STORAGE_KEYS.PANDALS, SEED_PANDALS);
    setStored(STORAGE_KEYS.LOCALITIES, SEED_LOCALITIES);
    setStored(STORAGE_KEYS.PLACES, SEED_PLACES);
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    memoryPandals = [...SEED_PANDALS];
    memoryLocalities = [...SEED_LOCALITIES];
    memoryPlaces = [...SEED_PLACES];
    memoryAnnouncements = [...SEED_ANNOUNCEMENTS];
  },
};

