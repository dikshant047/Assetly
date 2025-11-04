"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "../app/(dashboard)/action"

export function LogoutButton() {
  async function handleLogout() {
    await logout()
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