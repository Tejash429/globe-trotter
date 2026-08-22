import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an authenticated session
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/itinerary",
  "/create-trip",
  "/trips",
];

// Routes meant only for unauthenticated guests
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token from cookies
  const token = request.cookies.get("token")?.value;

  const isProtectedRoute =
    pathname === "/" ||
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 1. If accessing a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. If already logged in and visiting login/register or root, redirect to dashboard
  if ((isAuthRoute || pathname === "/") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/...)
     * - static files (_next/static, _next/image, favicon.ico, images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
