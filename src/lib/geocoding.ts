import { Coordinate } from "./maps";

export interface LocationSuggestion {
  id: string;
  title: string;
  title_bn?: string;
  address: string;
  latitude: number;
  longitude: number;
  category: "pandal" | "landmark" | "place" | "locality" | "osm";
  categoryLabel: string;
  aliases?: string[];
}

export const KNOWN_KRISHNANAGAR_LOCATIONS: Record<string, LocationSuggestion> = {
  "chasapara-buri-maa": {
    id: "loc-chasapara-buri-maa",
    title: "Chasapara Buri Maa (চাষাপাড়া বুড়িমা)",
    title_bn: "চাষাপাড়া বুড়িমা",
    address: "Chasapara Main Road, Near Buri Maa Temple, Krishnanagar, Nadia - 741101",
    latitude: 23.410188,
    longitude: 88.496313,
    category: "pandal",
    categoryLabel: "Heritage Pandal",
    aliases: [
      "burima",
      "buri maa",
      "burimaa",
      "budima",
      "chasapara",
      "chashapara",
      "chasa para",
      "chasha para",
      "buri ma temple",
      "mandir",
      "barowari",
    ],
  },
  "krishnanagar-rajbari": {
    id: "loc-krishnanagar-rajbari",
    title: "Krishnanagar Rajbari (Rajrajeshwari / রাজবাড়ি)",
    title_bn: "কৃষ্ণনগর রাজবাড়ি (রাজরাজেশ্বরী)",
    address: "Krishnanagar Palace Compound, Rajbari, Krishnanagar, Nadia - 741101",
    latitude: 23.397453,
    longitude: 88.498662,
    category: "pandal",
    categoryLabel: "Royal Heritage",
    aliases: [
      "rajbari",
      "raajbari",
      "rajbari palace",
      "rajrajeshwari",
      "maharaja krishna chandra",
      "palace",
    ],
  },
  "kanthalpota-choto-maa": {
    id: "loc-kanthalpota-choto-maa",
    title: "Kanthalpota Barowari — Choto Maa (ছোটমা)",
    title_bn: "কাঁঠালপোতা বারোয়ারী — ছোটমা",
    address: "Kathalpota Main Crossing, Krishnanagar, Nadia - 741101",
    latitude: 23.405938,
    longitude: 88.500063,
    category: "pandal",
    categoryLabel: "Heritage Pandal",
    aliases: ["choto maa", "chotoma", "kanthalpota", "kathalpota", "choto ma"],
  },
  "baghadanga-bagha-maa": {
    id: "loc-baghadanga-bagha-maa",
    title: "Baghadanga Barowari — Bagha Maa (বাঘামা)",
    title_bn: "বাঘাডাঙ্গা বারোয়ারী — বাঘামা",
    address: "Baghadanga Road, Krishnanagar, Nadia - 741101",
    latitude: 23.403313,
    longitude: 88.485063,
    category: "pandal",
    categoryLabel: "Traditional Pandal",
    aliases: ["bagha maa", "baghama", "baghadanga", "bagha ma"],
  },
  "kathuria-para-sonama": {
    id: "loc-kathuria-para-sonama",
    title: "Kathuria Para Barowari — Sonama (সোনামা)",
    title_bn: "কাঠুরিয়াপাড়া বারোয়ারী — সোনামা",
    address: "Kathuria Para Main Road, Krishnanagar, Nadia - 741101",
    latitude: 23.413313,
    longitude: 88.495938,
    category: "pandal",
    categoryLabel: "Heritage Pandal",
    aliases: ["sonama", "sona maa", "kathuriapara", "kathuria para"],
  },
  "golapatti-barowari": {
    id: "loc-golapatti-barowari",
    title: "Golapatti Barowari (গোলাপট্টি বারোয়ারী)",
    title_bn: "গোলাপট্টি বারোয়ারী",
    address: "Golapatti Crossing, Central Market Area, Krishnanagar, Nadia - 741101",
    latitude: 23.4089,
    longitude: 88.5042,
    category: "pandal",
    categoryLabel: "Traditional Pandal",
    aliases: [
      "golapatti",
      "gola patti",
      "central market",
      "crossing",
      "bazaar",
      "barowari",
    ],
  },
  "hatarpara-barowari": {
    id: "loc-hatarpara-barowari",
    title: "Hatarpara Jagadhatri Barowari (হাটারপাড়া)",
    title_bn: "হাটারপাড়া বারোয়ারী",
    address: "Hatarpara Main Road, Krishnanagar, Nadia - 741101",
    latitude: 23.4115,
    longitude: 88.4996,
    category: "pandal",
    categoryLabel: "Traditional Pandal",
    aliases: ["hatarpara", "hatar para", "haatarpara", "barowari", "daker saaj"],
  },
  "radhanagar-barowari": {
    id: "loc-radhanagar-barowari",
    title: "Radhanagar Natun Barowari (রাধানগর নতুন বারোয়ারী)",
    title_bn: "রাধানগর বারোয়ারী",
    address: "Radhanagar More, Near Municipality Park, Krishnanagar, Nadia - 741101",
    latitude: 23.3985,
    longitude: 88.5058,
    category: "pandal",
    categoryLabel: "Art & Theme",
    aliases: ["radhanagar", "radha nagar", "natun barowari", "municipality park"],
  },
  "kathalpota-barowari": {
    id: "loc-kathalpota-barowari",
    title: "Kathalpota Jagadhatri (কাঁঠালপোতা)",
    title_bn: "কাঁঠালপোতা বারোয়ারী",
    address: "Kathalpota Junction, Krishnanagar, Nadia - 741101",
    latitude: 23.4048,
    longitude: 88.5112,
    category: "pandal",
    categoryLabel: "Traditional Pandal",
    aliases: ["kathalpota", "kathal pota", "kathaltala", "junction", "sangha"],
  },
  "bowbazar-barowari": {
    id: "loc-bowbazar-barowari",
    title: "Bowbazar Ma Maheshwari (বউবাজার মা মহেশ্বরী)",
    title_bn: "বউবাজার মা মহেশ্বরী",
    address: "Bowbazar Market Road, Krishnanagar, Nadia - 741101",
    latitude: 23.4061,
    longitude: 88.4982,
    category: "pandal",
    categoryLabel: "Traditional Pandal",
    aliases: [
      "bowbazar",
      "boubazar",
      "bou bazar",
      "bow bazar",
      "maheshwari",
      "market",
    ],
  },
  "palpara-barowari": {
    id: "loc-palpara-barowari",
    title: "Palpara Clay Artisans Barowari (পালপাড়া মৃৎশিল্পী)",
    title_bn: "পালপাড়া মৃৎশিল্পী লেন",
    address: "Palpara Artisan Lane, Krishnanagar, Nadia - 741101",
    latitude: 23.414,
    longitude: 88.5085,
    category: "pandal",
    categoryLabel: "Artisans Pandal",
    aliases: [
      "palpara",
      "paulpara",
      "pal para",
      "artisan",
      "mritshilpi",
      "clay idol",
    ],
  },
  "college-street-pandal": {
    id: "loc-college-street-pandal",
    title: "College Street / D.L. Roy Road (কলেজ স্ট্রিট)",
    title_bn: "কলেজ স্ট্রিট / ডি এল রায় রোড",
    address: "D.L. Roy Road, College Street Area, Krishnanagar, Nadia - 741101",
    latitude: 23.4055,
    longitude: 88.4912,
    category: "pandal",
    categoryLabel: "Cultural Landmark",
    aliases: [
      "college street",
      "college",
      "dl roy road",
      "d l roy road",
      "collegiate school",
      "krishnagar govt college",
    ],
  },
  "ghoshpara-barowari": {
    id: "loc-ghoshpara-barowari",
    title: "Ghoshpara Jagadhatri Samiti (ঘোষপাড়া)",
    title_bn: "ঘোষপাড়া বারোয়ারী",
    address: "Ghoshpara Road, Krishnanagar, Nadia - 741101",
    latitude: 23.3942,
    longitude: 88.5015,
    category: "pandal",
    categoryLabel: "Traditional Pandal",
    aliases: ["ghoshpara", "ghosh para", "samiti"],
  },
  "baghabatinitala-barowari": {
    id: "loc-baghabatinitala-barowari",
    title: "Baghabatinitala Barowari (বাঘাবতীনীতলা)",
    title_bn: "বাঘাবতীনীতলা",
    address: "Baghabatinitala Road, Krishnanagar, Nadia - 741101",
    latitude: 23.4095,
    longitude: 88.5065,
    category: "pandal",
    categoryLabel: "Traditional Pandal",
    aliases: ["baghabatinitala", "baghabatini tala", "baghabati tala"],
  },
  "sadhana-sangha": {
    id: "loc-sadhana-sangha",
    title: "Sadhana Sangha Barowari (High School Para / সাধনা সংঘ)",
    title_bn: "সাধনা সংঘ (হাই স্কুল পাড়া)",
    address: "High School Para, Krishnanagar, Nadia - 741101",
    latitude: 23.4082,
    longitude: 88.4965,
    category: "pandal",
    categoryLabel: "Neighborhood Pandal",
    aliases: [
      "sadhana sangha",
      "high school para",
      "highschool para",
      "school para",
    ],
  },
  "adhar-chandra-das": {
    id: "loc-adhar-chandra-das",
    title: "Adhar Chandra Das & Sons (Origin of Sarpuria & Sarbhaja)",
    title_bn: "আধার চন্দ্র দাস ও সন্স (ঐতিহাসিক সরপুরিয়া ও সরভাজা)",
    address: "Nediarpara Main Road, Krishnanagar, Nadia - 741101",
    latitude: 23.4042,
    longitude: 88.5035,
    category: "place",
    categoryLabel: "GI Heritage Sweets",
    aliases: [
      "adhar chandra das",
      "adhar das",
      "adhar",
      "sarpuria",
      "sarbhaja",
      "sweet",
      "mishti",
      "nediarpara",
    ],
  },
  "jalajog-sweets": {
    id: "loc-jalajog-sweets",
    title: "Jalajog Sweets & Refreshments (জলযোগ সুইটস)",
    title_bn: "জলযোগ সুইটস ও রিফ্রেশমেন্ট",
    address: "Post Office More, High Street, Krishnanagar, Nadia - 741101",
    latitude: 23.4018,
    longitude: 88.4975,
    category: "place",
    categoryLabel: "Sweet Shop",
    aliases: ["jalajog", "post office more", "sweets", "kochuri", "high street"],
  },
  "krishnanagar-station": {
    id: "loc-krishnanagar-station",
    title: "Krishnanagar City Junction Railway Station (সিটি স্টেশন)",
    title_bn: "কৃষ্ণনগর সিটি জংশন রেল স্টেশন",
    address: "Station Road, Krishnanagar City Junction - 741101",
    latitude: 23.3948,
    longitude: 88.512,
    category: "place",
    categoryLabel: "Railway Station",
    aliases: [
      "station",
      "city junction",
      "krishnagar station",
      "railway station",
      "train station",
    ],
  },
  "mohona-bus-terminal": {
    id: "loc-mohona-bus-terminal",
    title: "Krishnanagar Central Bus Terminal (Mohona Bus Stand)",
    title_bn: "মোহনা বাস স্ট্যান্ড (সেন্ট্রাল বাস টার্মিনাল)",
    address: "Mohona Bus Stand Road, Krishnanagar, Nadia - 741101",
    latitude: 23.401,
    longitude: 88.509,
    category: "place",
    categoryLabel: "Bus Stand",
    aliases: ["bus stand", "bus terminal", "mohona", "central bus stand"],
  },
  "cathedral-church": {
    id: "loc-cathedral-church",
    title: "Cathedral Church of the Holy Rosary (ক্যাথিড্রাল চার্চ)",
    title_bn: "ক্যাথিড্রাল চার্চ মোড়",
    address: "Cathedral Road, Krishnanagar, Nadia - 741101",
    latitude: 23.4005,
    longitude: 88.4988,
    category: "landmark",
    categoryLabel: "Historic Church",
    aliases: [
      "cathedral",
      "church",
      "catholic church",
      "cathedral road",
      "holy rosary",
    ],
  },
  "district-hospital": {
    id: "loc-district-hospital",
    title: "Nadia District Hospital / Shaktinagar Hospital (জেলা হাসপাতাল)",
    title_bn: "শক্তিনগর জেলা হাসপাতাল",
    address: "D.L. Roy Road, Saktinagar, Krishnanagar, Nadia - 741101",
    latitude: 23.4056,
    longitude: 88.4913,
    category: "place",
    categoryLabel: "Hospital",
    aliases: [
      "hospital",
      "district hospital",
      "shaktinagar hospital",
      "saktinagar",
      "zilla hospital",
      "emergency",
    ],
  },
  "kotwali-police-station": {
    id: "loc-kotwali-police-station",
    title: "Kotwali Police Station Headquarters (কোতোয়ালি থানা সদর দপ্তর)",
    title_bn: "কোতোয়ালি থানা সদর দপ্তর",
    address: "Police Line Road, Krishnanagar, Nadia - 741101",
    latitude: 23.4035,
    longitude: 88.4998,
    category: "place",
    categoryLabel: "Police Station",
    aliases: ["police", "thana", "kotwali", "police station", "control room"],
  },
  "krishnanagar-municipality": {
    id: "loc-krishnanagar-municipality",
    title: "Krishnanagar Municipality Office (কৃষ্ণনগর পৌরসভা)",
    title_bn: "কৃষ্ণনগর পৌরসভা ভবন",
    address: "High Street, Krishnanagar, Nadia - 741101",
    latitude: 23.4028,
    longitude: 88.4982,
    category: "place",
    categoryLabel: "Civic Office",
    aliases: [
      "municipality",
      "pourosava",
      "nagar palika",
      "civic office",
      "high street",
    ],
  },
  charakdanga: {
    id: "loc-charakdanga",
    title: "Charakdanga More (চরকডাঙ্গা মোড়)",
    title_bn: "চরকডাঙ্গা মোড়",
    address: "Charakdanga Road, Krishnanagar, Nadia - 741101",
    latitude: 23.4132,
    longitude: 88.5012,
    category: "locality",
    categoryLabel: "Locality",
    aliases: ["charakdanga", "charak danga", "more", "crossing"],
  },
  "anandamoyee-tala": {
    id: "loc-anandamoyee-tala",
    title: "Ananda Moyee Tala (আনন্দময়ীতলা)",
    title_bn: "আনন্দময়ীতলা",
    address: "Ananda Moyee Tala Road, Krishnanagar, Nadia - 741101",
    latitude: 23.4068,
    longitude: 88.4935,
    category: "landmark",
    categoryLabel: "Landmark",
    aliases: [
      "ananda moyee tala",
      "anandamoyee",
      "anandamoyee tala",
      "mandir",
    ],
  },
};

/**
 * Phonetic & transliteration normalization for Bengali-English search.
 * Handles variations like:
 * - "sh" vs "s" (chashapara / chasapara)
 * - "w" vs "u" (bowbazar / boubazar)
 * - "v" vs "b" (barowari / baroari)
 * - "ee" vs "i", "oo" vs "u"
 * - "di" vs "ri" (budima / burima)
 */
export function normalizeQuery(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/[,\.\-\(\)\/]/g, " ")
    .replace(/sh/g, "s")
    .replace(/w/g, "u")
    .replace(/v/g, "b")
    .replace(/ee/g, "i")
    .replace(/oo/g, "u")
    .replace(/di/g, "ri")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Live address suggestions for Google Maps-style autocomplete.
 * Searches curated Krishnanagar landmarks, pandals, and points of interest,
 * with real-time fallback to OpenStreetMap Nominatim.
 */
export async function getKrishnanagarAddressSuggestions(
  query: string,
  maxResults = 8
): Promise<LocationSuggestion[]> {
  const qTrim = (query || "").trim();
  if (!qTrim) {
    // Return top popular suggestions when search query is empty
    return Object.values(KNOWN_KRISHNANAGAR_LOCATIONS).slice(0, 6);
  }

  // Check if query is a raw coordinate pair (e.g. "23.4072, 88.5028" or "23.4072 88.5028")
  const coordMatch = qTrim.match(
    /^(-?\d{1,2}(?:\.\d+)?)[,\s]+(-?\d{1,3}(?:\.\d+)?)$/
  );
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      return [
        {
          id: `coord-${lat.toFixed(6)}-${lng.toFixed(6)}`,
          title: `GPS Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          address: `Custom GPS Point (${lat.toFixed(6)}, ${lng.toFixed(6)}), Krishnanagar`,
          latitude: lat,
          longitude: lng,
          category: "osm",
          categoryLabel: "Direct GPS Coordinates",
        },
      ];
    }
  }

  const qNorm = normalizeQuery(qTrim);
  const qTokens = qNorm.split(" ").filter(Boolean);

  // 1. Search local indexed database
  const scoredResults: { suggestion: LocationSuggestion; score: number }[] = [];

  for (const item of Object.values(KNOWN_KRISHNANAGAR_LOCATIONS)) {
    const haystack = normalizeQuery(
      `${item.title} ${item.title_bn || ""} ${item.address} ${(item.aliases || []).join(" ")}`
    );
    const haystackCompact = haystack.replace(/\s+/g, "");

    // Check if every token in query matches something in haystack
    const allTokensMatch = qTokens.every(
      (tk) => haystack.includes(tk) || haystackCompact.includes(tk)
    );

    if (allTokensMatch) {
      let score = 10;
      const titleNorm = normalizeQuery(item.title);
      if (titleNorm.startsWith(qNorm)) score += 50;
      else if (titleNorm.includes(qNorm)) score += 30;
      if (item.category === "pandal") score += 15;
      if (item.category === "place") score += 10;

      scoredResults.push({ suggestion: item, score });
    }
  }

  // Sort by score
  scoredResults.sort((a, b) => b.score - a.score);
  const localSuggestions = scoredResults
    .slice(0, maxResults)
    .map((r) => r.suggestion);

  // 2. If we have at least 4 strong local matches, return them immediately
  if (localSuggestions.length >= 4) {
    return localSuggestions;
  }

  // 3. Fallback to OpenStreetMap Nominatim for general street/venue queries
  try {
    const encoded = encodeURIComponent(
      `${qTrim}, Krishnanagar, Nadia, West Bengal`
    );
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=4&countrycodes=in&viewbox=88.46,23.44,88.54,23.37`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "JagadhatriDarshan/1.0",
        },
      }
    );

    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items)) {
        for (const it of items) {
          const lat = parseFloat(it.lat);
          const lon = parseFloat(it.lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            // Avoid duplicate coordinates
            const alreadyExists = localSuggestions.some(
              (s) =>
                Math.abs(s.latitude - lat) < 0.0005 &&
                Math.abs(s.longitude - lon) < 0.0005
            );
            if (!alreadyExists) {
              const displayName = it.display_name as string;
              const titlePart = displayName.split(",")[0] || qTrim;
              localSuggestions.push({
                id: `osm-${it.place_id || lat.toFixed(4)}-${lon.toFixed(4)}`,
                title: titlePart,
                address: displayName,
                latitude: lat,
                longitude: lon,
                category: "osm",
                categoryLabel: "OpenStreetMap",
              });
            }
          }
        }
      }
    }
  } catch {
    // Ignore network error and return local matches
  }

  return localSuggestions.slice(0, maxResults);
}

/**
 * Single-match helper for direct address geocode
 */
export async function searchAddressGeocode(
  query: string
): Promise<{ address: string; coord: Coordinate } | null> {
  const suggestions = await getKrishnanagarAddressSuggestions(query, 1);
  if (suggestions.length > 0) {
    const best = suggestions[0];
    return {
      address: best.address,
      coord: { latitude: best.latitude, longitude: best.longitude },
    };
  }
  return null;
}
