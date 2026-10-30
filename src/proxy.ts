import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic edge guard. It only checks that a session cookie exists — the
 * private layout still verifies the session against the database, so a forged
 * cookie cannot open a private page. Doing the cheap check here avoids a
 * database round-trip before every private navigation.
 */
const PRIVATE_PREFIXES = ["/profile", "/create-event", "/manage-events", "/joined-events"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isPrivate = PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isPrivate) return NextResponse.next();

  const hasSessionCookie = Boolean(getSessionCookie(request));

  if (hasSessionCookie) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/create-event/:path*",
    "/manage-events/:path*",
    "/joined-events/:path*",
  ],
};
