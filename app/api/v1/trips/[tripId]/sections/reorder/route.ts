import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middlewares/authMiddleware";
import { TripService } from "@/lib/services/tripService";

export async function PUT(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const authPayload = authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
  }

  const { tripId } = await params;

  try {
    const body = await request.json();
    if (!body.sectionOrders || !Array.isArray(body.sectionOrders)) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "sectionOrders array is required" } }, { status: 400 });
    }

    const reorderedSections = await TripService.reorderSections(tripId, authPayload.userId, body.sectionOrders);
    return NextResponse.json({ success: true, message: "Sections reordered successfully", data: reorderedSections });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message } }, { status: error.statusCode || 500 });
  }
}
