import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/authService";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await AuthService.forgotPassword(body);
    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
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
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process request",
        },
      },
      { status: 500 }
    );
  }
}
