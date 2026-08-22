import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/authService";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await AuthService.login(body);
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: result,
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
          code: error.code || "INVALID_CREDENTIALS",
          message: error.message || "Invalid email or password",
        },
      },
      { status: error.statusCode || 401 }
    );
  }
}
