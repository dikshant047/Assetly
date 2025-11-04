"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { handleLogin } from "./action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [state, formAction] = useActionState(handleLogin, undefined)
  const router = useRouter()

  useEffect(() => {
    if (state?.message === "success" && state?.role) {
      // Small delay to ensure cookies are set
      setTimeout(() => {
        const redirectUrl = state.role === "ADMIN" ? "/admin" : "/investor"
        window.location.href = redirectUrl // Force full page reload
      }, 100)
    }
  }, [state])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@test.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {state?.message && state.message !== "success" && (
              <div className="p-3 text-sm bg-red-100 text-red-800 rounded-md">
                {state.message}
              </div>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" className="text-primary hover:underline">
                Create account
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}