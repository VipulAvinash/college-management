import { NextRequest, NextResponse } from "next/server";

// Middleware only checks whether a session COOKIE is present, to redirect
// unauthenticated page loads to /login. It intentionally does NOT decide
// authorization — every API route independently calls requireAdmin()
// against the database, because middleware must stay fast/edge-friendly
// and cannot be the sole gatekeeper for security-sensitive logic
// (requirement #31).
const SESSION_COOKIE_NAME = "session_id";
const PROTECTED_PREFIX = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(PROTECTED_PREFIX)) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
