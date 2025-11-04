"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
  const cookieStore = await cookies()
  
  // Delete custom cookies
  cookieStore.delete("auth_token")
  cookieStore.delete("user_role")
  
  // Redirect to login
  redirect("/login")
}