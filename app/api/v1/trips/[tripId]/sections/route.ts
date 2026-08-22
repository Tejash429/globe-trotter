import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middlewares/authMiddleware";
import { TripService } from "@/lib/services/tripService";
import { ZodError } from "zod";

// POST /api/v1/trips/:tripId/sections (Build Itinerary Section - Screen 5)
// Supports single section object OR batch array { sections: [...] }
export async function POST(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const authPayload = authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      },
      { status: 401 }
    );
  }

  const { tripId } = await params;

  try {
    const body = await request.json();

    // Check if payload contains batch sections array
    if (body.sections && Array.isArray(body.sections)) {
      const result = await TripService.addBatchSections(tripId, authPayload.userId, body.sections);
      return NextResponse.json(
        {
          success: true,
          message: "Itinerary sections added successfully",
          data: result,
        },
        { status: 201 }
      );
    } else {
      // Single section creation
      const result = await TripService.addSection(tripId, authPayload.userId, body);
      return NextResponse.json(
        {
          success: true,
          message: "Itinerary section created successfully",
          data: result,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid section data",
            details: error.issues.map((e) => ({
              field: e.path.join("."),
              issue: e.message,
            })),
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code || "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to create section",
        },
      },
      { status: error.statusCode || 500 }
    );
  }
}

// GET /api/v1/trips/:tripId/sections (Get Sections - Screen 5)
export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const authPayload = authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      },
      { status: 401 }
    );
  }

  const { tripId } = await params;

  try {
    const result = await TripService.getTripSections(tripId, authPayload.userId);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code || "NOT_FOUND",
          message: error.message || "Failed to fetch sections",
        },
      },
      { status: error.statusCode || 404 }
    );
  }
}
