import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middlewares/authMiddleware";
import { AuthService } from "@/lib/services/authService";
import { ZodError } from "zod";

// GET /api/v1/auth/me (Get current logged-in user profile details)
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

  try {
    const user = await AuthService.getCurrentUser(authPayload.userId);
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code || "NOT_FOUND",
          message: error.message || "Failed to fetch user profile",
        },
      },
      { status: error.statusCode || 404 }
    );
  }
}

// PUT /api/v1/auth/me (Update current logged-in user profile)
export async function PUT(request: Request) {
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
    const updatedUser = await AuthService.updateProfile(authPayload.userId, body);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid profile data",
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
          message: error.message || "Failed to update profile",
        },
      },
      { status: error.statusCode || 500 }
    );
  }
}

// PATCH /api/v1/auth/me (Alias for partial update)
export async function PATCH(request: Request) {
  return PUT(request);
}
