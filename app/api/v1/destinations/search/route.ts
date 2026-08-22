import { NextResponse } from "next/server";

export interface CityResult {
  id: string;
  name: string;
  country: string;
  region?: string;
  label: string;
}

/**
 * GET /api/v1/destinations/search?q=Jaipur
 * Dynamically queries public City APIs (Teleport API & OpenStreetMap Nominatim API & OpenTripMap API)
 * Returns validated real-world cities and states globally without hardcoding.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: true,
      data: [],
    });
  }

  const resultsMap = new Map<string, CityResult>();

  try {
    // 1. Query Teleport Global Cities API (Public, returns clean city/state/country labels)
    const teleportUrl = `https://api.teleport.org/api/cities/?search=${encodeURIComponent(query)}&limit=10`;
    const teleportRes = await fetch(teleportUrl, {
      headers: { UserAgent: "GlobeTrotter/1.0" },
      next: { revalidate: 3600 },
    });

    if (teleportRes.ok) {
      const teleportData = await teleportRes.json();
      const searchResults = teleportData?._embedded?.["city:search-results"] || [];

      searchResults.forEach((item: any, idx: number) => {
        const fullName = item?.matching_full_name;
        if (fullName && typeof fullName === "string") {
          const parts = fullName.split(",").map((p) => p.trim());
          const cityName = parts[0];
          const countryName = parts[parts.length - 1];
          const regionName = parts.length > 2 ? parts[1] : undefined;

          const label = fullName;
          if (!resultsMap.has(label.toLowerCase())) {
            resultsMap.set(label.toLowerCase(), {
              id: `teleport_${idx}_${Date.now()}`,
              name: cityName,
              region: regionName,
              country: countryName,
              label,
            });
          }
        }
      });
    }
  } catch (err) {
    console.warn("Teleport Cities API search failed:", err);
  }

  // 2. Query OpenStreetMap Nominatim API if more results are needed
  if (resultsMap.size < 5) {
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=8`;
      const nominatimRes = await fetch(nominatimUrl, {
        headers: { "User-Agent": "GlobeTrotter-Travel-App/1.0" },
      });

      if (nominatimRes.ok) {
        const nominatimData: any[] = await nominatimRes.json();

        if (Array.isArray(nominatimData)) {
          nominatimData.forEach((item, idx) => {
            const addr = item.address || {};
            const cityName =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.state_district ||
              addr.county ||
              item.display_name.split(",")[0];

            const stateName = addr.state || addr.region;
            const countryName = addr.country || "";

            if (cityName) {
              const labelParts = [cityName];
              if (stateName && stateName !== cityName) labelParts.push(stateName);
              if (countryName) labelParts.push(countryName);

              const label = labelParts.join(", ");
              if (!resultsMap.has(label.toLowerCase())) {
                resultsMap.set(label.toLowerCase(), {
                  id: `osm_${item.place_id || idx}`,
                  name: cityName,
                  region: stateName,
                  country: countryName,
                  label,
                });
              }
            }
          });
        }
      }
    } catch (err) {
      console.warn("Nominatim API search failed:", err);
    }
  }

  // 3. OpenTripMap Geocoding API Backup if API Key is available
  const apiKey = process.env.OPENTRIPMAP_KEY;
  if (resultsMap.size < 3 && apiKey && apiKey !== "your_opentripmap_api_key_here") {
    try {
      const geonameUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(query)}&apikey=${apiKey}`;
      const otmRes = await fetch(geonameUrl);
      if (otmRes.ok) {
        const otmData = await otmRes.json();
        if (otmData && otmData.name && (otmData.status === "OK" || otmData.lat)) {
          const label = `${otmData.name}, ${otmData.country || ""}`.replace(/,\s*$/, "");
          if (!resultsMap.has(label.toLowerCase())) {
            resultsMap.set(label.toLowerCase(), {
              id: `otm_geo_${Date.now()}`,
              name: otmData.name,
              country: otmData.country || "Global",
              label,
            });
          }
        }
      }
    } catch (otmErr) {
      console.warn("OpenTripMap geoname search failed", otmErr);
    }
  }

  const finalResults = Array.from(resultsMap.values()).slice(0, 10);

  return NextResponse.json({
    success: true,
    data: finalResults,
  });
}
