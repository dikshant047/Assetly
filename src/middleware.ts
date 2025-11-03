import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const session = await auth()
  const { pathname } = req.nextUrl

  console.log("🔐 Middleware:", { 
    pathname, 
    isLoggedIn: !!session, 
    userRole: session?.user?.role 
  })

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isAdminRoute = pathname.startsWith("/admin")
  const isInvestorRoute = pathname.startsWith("/investor")
  const isProtectedRoute = isAdminRoute || isInvestorRoute

  // If logged in and trying to access auth pages, redirect to dashboard
  if (isAuthRoute && session) {
    const redirectUrl = session.user?.role === "ADMIN" ? "/admin" : "/investor"
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  // If not logged in and trying to access protected routes, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If admin trying to access investor page, redirect to admin
  if (isAdminRoute && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/investor", req.url))
  }

  // If investor trying to access admin page, redirect to investor
  if (isInvestorRoute && session?.user?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
}