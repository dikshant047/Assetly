"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function authenticate(
  prevState: string | null,
  formData: FormData
): Promise<string | null> {
  console.log("🔵 Action called!")  // ← This should appear FIRST
  
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("🔵 Email:", email)
    console.log("🔵 Password length:", password?.length)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,  // ← CRITICAL: Don't auto-redirect yet
    })

    console.log("🟢 SignIn result:", result)

    if (result?.error) {
      console.log("🔴 Error from signIn:", result.error)
      return "Invalid email or password"
    }

    // If successful, manually redirect
    console.log("✅ Login successful, redirecting...")
    return null  // Success, form will handle redirect via middleware
    
  } catch (error) {
    console.log("🔴 Caught error:", error)
    
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password"
        default:
          return "Something went wrong"
      }
    }
    
    return "An error occurred"
  }
}