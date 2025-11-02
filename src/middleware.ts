import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

console.log("🔐 Middleware:", { pathname: nextUrl.pathname, isLoggedIn, userRole })

  // Define route patterns
  const isAuthRoute = nextUrl.pathname.startsWith("/login");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isInvestorRoute = nextUrl.pathname.startsWith("/investor");
  const isProtectedRoute = isAdminRoute || isInvestorRoute;

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    const role = req.auth?.user?.role;
    const redirectUrl = role === "ADMIN" ? "/admin" : "/investor";
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }

  // Redirect non-authenticated users to login
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Role-based access control
  if (isLoggedIn && isProtectedRoute) {
    const role = req.auth?.user?.role;

    // Prevent investors from accessing admin routes
    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/investor", nextUrl));
    }

    // Prevent admins from accessing investor routes (optional)
    // if (isInvestorRoute && role === "ADMIN") {
    //   return NextResponse.redirect(new URL("/admin", nextUrl));
    // }
  }

return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
