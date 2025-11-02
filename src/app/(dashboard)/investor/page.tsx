import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Wallet
} from "lucide-react";
import { auth } from "@/lib/auth"

export default async function InvestorDashboard() {
  const session = await auth()
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Investment</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {session?.user?.name}
          </p>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
          <p className="text-muted-foreground">
            Your investment details will appear here in Chunk 7.
          </p>
        </div>
      </div>
    </div>
  )
}