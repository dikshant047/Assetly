"use server"

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function handleLogin(
  prevState: { message: string; role?: string } | undefined,
  formData: FormData
): Promise<{ message: string; role?: string }> {
  console.log("🔵 Login action called")

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("🔵 Email:", email)
  console.log("🔵 Password length:", password?.length)

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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    console.log("🟢 SignIn result:", result)

    if (!result) {
      return { message: "Invalid credentials" }
    }

    console.log("✅ Login successful, role:", user.role)
    return { message: "success", role: user.role }

  } catch (error) {
    console.error("🔴 Login error:", error)
    return { message: "Invalid email or password" }
  }
}