import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth configuration (no Prisma, no bcrypt)
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [], // Providers will be added in auth.ts
  callbacks: {
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
      const isAdminRoute = pathname.startsWith("/admin");
      const isInvestorRoute = pathname.startsWith("/investor");
      const isProtectedRoute = isAdminRoute || isInvestorRoute;

      // If already logged in and trying to access auth pages, redirect to dashboard
      if (isAuthRoute && isLoggedIn) {
        const redirectUrl = role === "ADMIN" ? "/admin" : "/investor";
        return Response.redirect(new URL(redirectUrl, request.nextUrl));
      }

      // If not logged in and trying to access protected pages, redirect to login
      if (isProtectedRoute && !isLoggedIn) {
        return false; // Will redirect to signIn page
      }

      // If admin trying to access investor page, redirect to admin
      if (isInvestorRoute && role === "ADMIN") {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }

      // If investor trying to access admin page, redirect to investor
      if (isAdminRoute && role !== "ADMIN") {
        return Response.redirect(new URL("/investor", request.nextUrl));
      }

      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
};

// Only export auth for middleware (reduces bundle size)
export const { auth } = NextAuth(authConfig);
