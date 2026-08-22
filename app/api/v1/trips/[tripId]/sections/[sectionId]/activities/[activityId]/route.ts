import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middlewares/authMiddleware";
import { TripService } from "@/lib/services/tripService";
import { updateActivitySchema } from "@/lib/validations/trip";
import { ZodError } from "zod";

// PUT /api/v1/trips/:tripId/sections/:sectionId/activities/:activityId (Update Activity)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tripId: string; sectionId: string; activityId: string }> }
) {
  const authPayload = authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { tripId, sectionId, activityId } = await params;

  try {
    const body = await request.json();
    const validated = updateActivitySchema.parse(body);
    const updatedActivity = await TripService.updateActivity(
      tripId,
      sectionId,
      activityId,
      authPayload.userId,
      validated
    );

    return NextResponse.json({
      success: true,
      message: "Activity updated successfully",
      data: updatedActivity,
    });
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

// DELETE /api/v1/trips/:tripId/sections/:sectionId/activities/:activityId (Delete Activity)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string; sectionId: string; activityId: string }> }
) {
  const authPayload = authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { tripId, sectionId, activityId } = await params;

  try {
    const result = await TripService.deleteActivity(tripId, sectionId, activityId, authPayload.userId);
    return NextResponse.json({
      success: true,
      message: result.message,
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
