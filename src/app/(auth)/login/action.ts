"use server"

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AuthError } from "next-auth"

export async function handleLogin(
  prevState: { message: string; role?: string } | undefined,
  formData: FormData
): Promise<{ message: string; role?: string }> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { message: "Email and password are required" }
  }

  try {
    // Fetch user to get role before signing in
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    })

    if (!user) {
      return { message: "Invalid email or password" }
    }

    // NextAuth v5 signIn throws error on failure, succeeds silently
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { message: "success", role: user.role }

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid email or password" }
        default:
          return { message: "Something went wrong" }
      }
    }

    return { message: "Invalid email or password" }
  }
}