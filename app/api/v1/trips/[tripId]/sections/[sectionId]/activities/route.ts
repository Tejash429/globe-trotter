import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middlewares/authMiddleware";
import { TripService } from "@/lib/services/tripService";
import { createActivitySchema } from "@/lib/validations/trip";
import { ZodError } from "zod";

// POST /api/v1/trips/:tripId/sections/:sectionId/activities (Add Activity)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string; sectionId: string }> }
) {
  const authPayload = authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { tripId, sectionId } = await params;

  try {
    const body = await request.json();
    const validated = createActivitySchema.parse(body);
    const activity = await TripService.addActivity(tripId, sectionId, authPayload.userId, validated);

    return NextResponse.json(
      {
        success: true,
        message: "Activity added to section stop successfully",
        data: activity,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid activity data",
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
        error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message },
      },
      { status: error.statusCode || 500 }
    );
  }
}

// GET /api/v1/trips/:tripId/sections/:sectionId/activities (Get Section with Activities)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ tripId: string; sectionId: string }> }
) {
  const authPayload = authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { tripId, sectionId } = await params;

  try {
    const section = await TripService.getSectionWithActivities(tripId, sectionId, authPayload.userId);
    return NextResponse.json({
      success: true,
      data: section,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: error.code || "NOT_FOUND", message: error.message },
      },
      { status: error.statusCode || 404 }
    );
  }
}
