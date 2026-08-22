import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middlewares/authMiddleware";
import { TripService } from "@/lib/services/tripService";
import { ZodError } from "zod";

// POST /api/v1/trips (Create Trip - Screen 4)
export async function POST(request: Request) {
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

  try {
    const body = await request.json();
    const result = await TripService.createTrip(authPayload.userId, body);
    return NextResponse.json(
      {
        success: true,
        message: "Trip created successfully",
        data: result,
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
            message: "Invalid trip input data",
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
          message: error.message || "Failed to create trip",
        },
      },
      { status: error.statusCode || 500 }
    );
  }
}

// GET /api/v1/trips (List User Trips - Screen 6)
export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as any;
  const search = searchParams.get("search") || undefined;
  const sortBy = (searchParams.get("sortBy") as any) || "startDate";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  try {
    const result = await TripService.getTrips(authPayload.userId, {
      status,
      search,
      sortBy,
      page,
      limit,
    });
    return NextResponse.json({
      success: true,
      data: {
        trips: result.trips,
        pagination: result.pagination,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to fetch trips",
        },
      },
      { status: 500 }
    );
  }
}
