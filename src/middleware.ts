import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Get the session token from cookies (NextAuth stores it as authjs.session-token or next-auth.session-token)
  const sessionToken = req.cookies.get("authjs.session-token")?.value ||
                       req.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
  const isAdminRoute = path.startsWith("/admin");
  const isInvestorRoute = path.startsWith("/investor");
  const isProtectedRoute = isAdminRoute || isInvestorRoute;

  // Allow access to auth routes if not logged in
  if (isAuthRoute && !isLoggedIn) {
    return NextResponse.next();
  }

  // If logged in and trying to access auth pages, let the auth config handle redirect
  if (isAuthRoute && isLoggedIn) {
    // We'll let the server component check the role and redirect appropriately
    return NextResponse.next();
  }

  // If trying to access protected routes without login, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // For protected routes with login, let the server component handle role-based redirects
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};