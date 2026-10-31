/**
 * Route protection.
 *
 * NOTE — Next.js 16 renamed Middleware to Proxy (proxy.js, same API and the
 * same getSessionCookie strategy from better-auth/cookies).
 *
 * This is an OPTIMISTIC check only: if a session cookie exists we let the
 * page through. Pages themselves still gate on the live BetterAuth session
 * (with a loading skeleton) so a logged-in reload never redirects to /login.
 */
import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED = [
  "/dashboard",
  "/add-studio",
  "/my-listings",
  "/my-bookings",
  "/wishlist",
];

export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the destination so login can return the user here.
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    const res = NextResponse.redirect(loginUrl);
    res.headers.set("x-studiospace-redirected-from", pathname);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/add-studio/:path*",
    "/my-listings/:path*",
    "/my-bookings/:path*",
    "/wishlist/:path*",
  ],
};
