import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth , signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
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
});
