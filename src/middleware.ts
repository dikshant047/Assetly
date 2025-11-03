import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseAuth(cookies: NextRequest["cookies"]) {
  const token = cookies.get("auth_token")?.value;
  const role = cookies.get("user_role")?.value || "INVESTOR";
  return { isLoggedIn: !!token, role };
}

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const { isLoggedIn, role } = parseAuth(cookies);

  const path = nextUrl.pathname;
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
  const isAdminRoute = path.startsWith("/admin");
  const isInvestorRoute = path.startsWith("/investor");
  const isProtectedRoute = isAdminRoute || isInvestorRoute;

  console.log("🔐 Middleware:", { path, isLoggedIn, role });

  if (isAuthRoute && isLoggedIn) {
    const redirectUrl = role === "ADMIN" ? "/admin" : "/investor";
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/investor", nextUrl));
  }

  if (isInvestorRoute && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};