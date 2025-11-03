"use server"

import { signIn } from "@/lib/auth"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function handleLogin(
  prevState: { message: string } | undefined,
  formData: FormData
): Promise<{ message: string }> {
  console.log("🔵 Login action called")

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("🔵 Email:", email)
  console.log("🔵 Password length:", password?.length)

  if (!email || !password) {
    return { message: "Email and password are required" }
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    console.log("🟢 SignIn result:", result)

    if (!result) {
      return { message: "Invalid credentials" }
    }

    // Fetch user to get role
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    })

    if (!user) {
      return { message: "User not found" }
    }

    // Set cookies for middleware
    const cookieStore = await cookies()
    
    cookieStore.set("auth_token", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    })
    
    cookieStore.set("user_role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    })

    console.log("✅ Login successful, cookies set, role:", user.role)
    return { message: "success" }

  } catch (error) {
    console.error("🔴 Login error:", error)
    return { message: "Invalid email or password" }
  }
}