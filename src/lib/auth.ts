import NextAuth from "next-auth"; 
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const prisma = new PrismaClient();

export const { handlers, auth , signIn, signOut } = NextAuth({
   session: {
    strategy: "jwt",  // ← ADD THIS
  },
   
  providers: [
    Credentials({ 
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
  console.log("🟡 Authorize called with:", credentials)  // ← ADD THIS
  
  const parsed = credentialsSchema.safeParse(credentials);
  
  if (!parsed.success) {
    console.log("🔴 Validation failed")  // ← ADD THIS
    return null;
  }
  
  const { email, password } = parsed.data;
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  console.log("👤 User found:", user ? "YES" : "NO")  // ← ADD THIS

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password)
  
  console.log("🔑 Password valid:", isValid)  // ← ADD THIS

  if (!isValid) return null;

  console.log("✅ Returning user")  // ← ADD THIS
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
  }, 
  pages: {
    signIn: '/login', 
  }, 
  secret: process.env.NEXTAUTH_SECRET,
});
