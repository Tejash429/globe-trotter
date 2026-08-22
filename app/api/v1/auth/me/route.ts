import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middlewares/authMiddleware";
import { AuthService } from "@/lib/services/authService";

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
