"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  async function handleLogout() {
    // Clear custom cookies
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    
    // Sign out with NextAuth
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <Button 
      onClick={handleLogout}
      variant="outline"
      size="sm"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  )
}