"use client"

import { useActionState } from "react"  // ← Changed
import { useFormStatus } from "react-dom"
import { authenticate } from "./action"
import { useEffect } from "react"  // ← Add this
import { useRouter } from "next/navigation"  // ← Add this
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export default function LoginPage() {
  const [errorMessage, formAction] = useActionState<string | null, FormData>(
  authenticate, 
  undefined
)
  const router = useRouter()

  // If login successful (no error), redirect
  useEffect(() => {
    if (errorMessage === null) {
      console.log("✅ Redirecting to admin...")
      router.push("/admin")
    }
  }, [errorMessage, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">InvestTrack</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Sign in to your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              {errorMessage && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {errorMessage}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>

              <SubmitButton />
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link href="#" className="text-primary hover:underline">
                Contact your administrator
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Secure institutional-grade authentication
        </p>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  )
} 