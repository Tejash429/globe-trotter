import { NextResponse } from "next/server";
import { getOpenTripMapSuggestions } from "@/lib/services/openTripMapService";

// GET /api/v1/destinations/suggestions?destination=Jaipur
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination") || searchParams.get("place");

  if (!destination || !destination.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "BAD_REQUEST", message: "destination parameter is required" },
      },
      { status: 400 }
    );
  }

  try {
    const suggestions = await getOpenTripMapSuggestions(destination);
    return NextResponse.json({
      success: true,
      data: {
        destination,
        suggestions,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to fetch destination suggestions",
        },
      },
      { status: 500 }
    );
  }
}
