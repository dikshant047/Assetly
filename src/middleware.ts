import { NextResponse } from "next/server";

export async function middleware(req) {
  const { nextUrl, cookies } = req;
  const token = cookies.get("auth_token")?.value;
  const isLoggedIn = Boolean(token);

  const isAuthRoute = nextUrl.pathname.startsWith("/login");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isInvestorRoute = nextUrl.pathname.startsWith("/investor");
  const isProtectedRoute = isAdminRoute || isInvestorRoute;

  if (isAuthRoute && isLoggedIn) {
    // Decode role from a lightweight cookie/JWT if needed
    const role = cookies.get("user_role")?.value || "INVESTOR";
    const redirectUrl = role === "ADMIN" ? "/admin" : "/investor";
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && isProtectedRoute) {
    const role = cookies.get("user_role")?.value;
    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/investor", nextUrl));
    }
    if (isInvestorRoute && role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
