export interface PlaceSuggestion {
  id: string;
  title: string;
  description: string;
  category?: string;
  imageUrl?: string;
  kinds?: string;
}

/**
 * Service to fetch real places of interest for a destination city using OpenTripMap API.
 * Uses process.env.OPENTRIPMAP_KEY with graceful fallback if key is missing or request fails.
 */
export async function getOpenTripMapSuggestions(destinationPlace: string): Promise<PlaceSuggestion[]> {
  const place = destinationPlace.trim();
  const apiKey = process.env.OPENTRIPMAP_KEY;

  if (!apiKey || apiKey === "your_opentripmap_api_key_here") {
    console.warn("OPENTRIPMAP_KEY is missing or invalid. Falling back to default place suggestions.");
    return getDefaultFallbackSuggestions(place);
  }

  try {
    // Step 1: Geocoding - Get lat/lon for the destination city/stop
    const geonameUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(place)}&apikey=${apiKey}`;
    const geonameRes = await fetch(geonameUrl, { cache: "no-store" });

    if (!geonameRes.ok) {
      console.warn(`OpenTripMap geoname failed for ${place}: ${geonameRes.status}`);
      return getDefaultFallbackSuggestions(place);
    }

    const geonameData = await geonameRes.json();
    if (!geonameData || typeof geonameData.lat !== "number" || typeof geonameData.lon !== "number") {
      console.warn(`OpenTripMap could not find coordinates for ${place}`);
      return getDefaultFallbackSuggestions(place);
    }

    const { lat, lon } = geonameData;

    // Step 2: Radius search for top attractions within 15km radius (rate=2 for popular places)
    const radiusUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=15000&lon=${lon}&lat=${lat}&rate=2&format=json&limit=15&apikey=${apiKey}`;
    const radiusRes = await fetch(radiusUrl, { cache: "no-store" });

    if (!radiusRes.ok) {
      console.warn(`OpenTripMap radius search failed for ${place}: ${radiusRes.status}`);
      return getDefaultFallbackSuggestions(place);
    }

    const rawPlaces: any[] = await radiusRes.json();

    if (!Array.isArray(rawPlaces) || rawPlaces.length === 0) {
      return getDefaultFallbackSuggestions(place);
    }

    // Filter places with valid names
    const validPlaces = rawPlaces.filter(
      (p) => p && p.name && p.name.trim().length > 0 && p.xid
    );

    // Remove duplicate names
    const uniquePlacesMap = new Map<string, any>();
    for (const p of validPlaces) {
      const nameKey = p.name.trim().toLowerCase();
      if (!uniquePlacesMap.has(nameKey)) {
        uniquePlacesMap.set(nameKey, p);
      }
    }

    const uniquePlaces = Array.from(uniquePlacesMap.values()).slice(0, 8);

    if (uniquePlaces.length === 0) {
      return getDefaultFallbackSuggestions(place);
    }

    // Step 3: Fetch place details (XID) in parallel for descriptions
    const detailedPlaces = await Promise.all(
      uniquePlaces.map(async (p, idx) => {
        try {
          const detailUrl = `https://api.opentripmap.com/0.1/en/places/xid/${p.xid}?apikey=${apiKey}`;
          const detailRes = await fetch(detailUrl, { cache: "no-store" });

          if (detailRes.ok) {
            const detail = await detailRes.json();
            const extractText = detail.wikipedia_extracts?.text || detail.info?.descr;
            const cleanDescription = extractText
              ? extractText.length > 140
                ? extractText.substring(0, 140) + "..."
                : extractText
              : formatKindsToDescription(p.kinds || detail.kinds || "", place);

            return {
              id: p.xid || `otm_${idx}`,
              title: detail.name || p.name,
              description: cleanDescription,
              category: getCategoryFromKinds(p.kinds || detail.kinds || ""),
              imageUrl: detail.preview?.source || detail.image || undefined,
              kinds: p.kinds || detail.kinds,
            };
          }
        } catch {
          // Ignore individual detail fetch failure
        }

        return {
          id: p.xid || `otm_${idx}`,
          title: p.name,
          description: formatKindsToDescription(p.kinds || "", place),
          category: getCategoryFromKinds(p.kinds || ""),
          kinds: p.kinds,
        };
      })
    );

    return detailedPlaces;
  } catch (err) {
    console.error("OpenTripMap API error:", err);
    return getDefaultFallbackSuggestions(place);
  }
}

function formatKindsToDescription(kinds: string, place: string): string {
  if (!kinds) return `Famous attraction and point of interest in ${place}.`;

  const readableKinds = kinds
    .split(",")
    .map((k) => k.replace(/_/g, " "))
    .filter((k) => !["interesting places", "tourist facilities"].includes(k))
    .slice(0, 3)
    .join(", ");

  return readableKinds
    ? `Popular ${readableKinds} in ${place}.`
    : `Must-see point of interest in ${place}.`;
}

function getCategoryFromKinds(kinds: string): string {
  if (kinds.includes("historic") || kinds.includes("architecture") || kinds.includes("monument")) {
    return "SIGHTSEEING";
  }
  if (kinds.includes("museum") || kinds.includes("cultural") || kinds.includes("art")) {
    return "CULTURE";
  }
  if (kinds.includes("foods") || kinds.includes("shops") || kinds.includes("market")) {
    return "FOOD";
  }
  if (kinds.includes("nature") || kinds.includes("park") || kinds.includes("beach")) {
    return "ADVENTURE";
  }
  return "SIGHTSEEING";
}

function getDefaultFallbackSuggestions(place: string): PlaceSuggestion[] {
  return [
    {
      id: "sug_1",
      title: `Explore Central ${place}`,
      description: `Must-see landmarks, historic squares, and walking tours around central ${place}.`,
      category: "SIGHTSEEING",
    },
    {
      id: "sug_2",
      title: `${place} Culinary & Local Markets`,
      description: `Taste local food specialties, historic food halls, and night markets in ${place}.`,
      category: "FOOD",
    },
    {
      id: "sug_3",
      title: `Art & Heritage Museums in ${place}`,
      description: `Visit top museums, galleries, and cultural heritage centers in ${place}.`,
      category: "CULTURE",
    },
    {
      id: "sug_4",
      title: `${place} Scenic Parks & Viewpoints`,
      description: `Scenic outdoor parks, botanical gardens, and panoramic city viewpoints.`,
      category: "ADVENTURE",
    },
  ];
}
