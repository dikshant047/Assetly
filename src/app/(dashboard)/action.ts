"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { signOut } from "@/lib/auth"

export async function logout() {
  try {
    const cookieStore = await cookies()

    // Delete custom cookies
    cookieStore.delete("auth_token")
    cookieStore.delete("user_role")

    // Sign out from NextAuth
    await signOut({ redirect: false })

  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Always redirect to login
    redirect("/login")
  }
}