import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Skip middleware for API routes, static files, and auth routes
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;

  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
  const isAdminRoute = path.startsWith("/admin");
  const isInvestorRoute = path.startsWith("/investor");
  const isProtectedRoute = isAdminRoute || isInvestorRoute;

  console.log("🔐 Middleware:", { path, isLoggedIn, role });

  // If already logged in and trying to access auth pages, redirect to dashboard
  if (isAuthRoute && isLoggedIn) {
    const redirectUrl = role === "ADMIN" ? "/admin" : "/investor";
    console.log("🔄 Redirecting logged-in user from auth page to:", redirectUrl);
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }

  // If not logged in and trying to access protected pages, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    console.log("🔄 Redirecting unauthenticated user to login");
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // If admin trying to access investor page, redirect to admin
  if (isInvestorRoute && role === "ADMIN") {
    console.log("🔄 Redirecting admin to admin dashboard");
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  // If investor trying to access admin page, redirect to investor
  if (isAdminRoute && role !== "ADMIN") {
    console.log("🔄 Redirecting non-admin to investor dashboard");
    return NextResponse.redirect(new URL("/investor", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};