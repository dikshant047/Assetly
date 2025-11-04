"use server"

import { redirect } from "next/navigation"
import { signOut } from "@/lib/auth"

export async function logout() {
  try {
    // Sign out from NextAuth
    await signOut({ redirect: false })
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Always redirect to login
    redirect("/login")
  }
}