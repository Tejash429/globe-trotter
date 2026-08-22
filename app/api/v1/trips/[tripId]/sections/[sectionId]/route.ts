import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middlewares/authMiddleware";
import { TripService } from "@/lib/services/tripService";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tripId: string; sectionId: string }> }
) {
  const authPayload = authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
  }

  const { tripId, sectionId } = await params;

  try {
    const body = await request.json();
    const updatedSection = await TripService.updateSection(sectionId, tripId, authPayload.userId, body);
    return NextResponse.json({ success: true, message: "Section updated successfully", data: updatedSection });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message } }, { status: error.statusCode || 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string; sectionId: string }> }
) {
  const authPayload = authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
  }

  const { tripId, sectionId } = await params;

  try {
    const result = await TripService.deleteSection(sectionId, tripId, authPayload.userId);
    return NextResponse.json({ success: true, message: result.message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: error.code || "NOT_FOUND", message: error.message } }, { status: error.statusCode || 404 });
  }
}
