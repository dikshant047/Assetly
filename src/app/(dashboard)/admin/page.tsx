import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {

  TrendingUp,
  DollarSign,
  Activity,
  Plus
} from "lucide-react";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/logout_button";
import { getPortfolio } from "@/lib/queries";
 import { PortfolioUpdateForm } from "./portolio-form"
import {AddInvestorForm} from "./add-investor-form";
import { RecordDepositForm } from "./record-deposit-form"
import { prisma } from "@/lib/prisma";
import { calculateInvestorValues } from "@/lib/calculations"
import { redirect } from "next/navigation";

export default async function AdminDashboard() {

  const session = await auth();

  // Redirect if not logged in
  if (!session?.user) {
    redirect("/login");
  }

  // Redirect if not admin
  if (session.user.role !== "ADMIN") {
    redirect("/investor");
  }
  const portfolio = await getPortfolio();
  
  const allUsers = await prisma.user.findMany();
  const allTransactions = await prisma.transaction.findMany();
  const totalInvested = allTransactions
    .filter(tx => tx.type === "DEPOSIT")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const investorValues = await calculateInvestorValues()

  const totalInvestors = allUsers.filter(u => u.role === "INVESTOR").length;  

  const totalWithdrawn = allTransactions
    .filter(tx => tx.type === "WITHDRAWAL")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
  const netInvested = totalInvested - totalWithdrawn;
  
  const currentValue = Number(portfolio?.currentValue || 0);
  const totalProfit = currentValue - netInvested;
  const profitPercentage = netInvested > 0 
       ? ((totalProfit / netInvested) * 100).toFixed(1) 
       : "0.0";

  const formattedValue = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
   trailingZeroDisplay: 'stripIfInteger'
}).format(Number(portfolio?.currentValue) || 0);
  
   const formattedDate = portfolio?.lastUpdated?new Date(portfolio.lastUpdated).toLocaleDateString('en-US', {
       month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  : 'Never';


  console.log("Portfolio:", portfolio);

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage investors and portfolios
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
  <CardHeader>
    <CardTitle>All Investors</CardTitle>
    <CardDescription>
      Current values and performance
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {investorValues.length === 0 ? (
        <p className="text-sm text-muted-foreground">No investors yet</p>
      ) : (
        investorValues.map((investor) => (
          <div key={investor.id} className="border-b border-border pb-4 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{investor.name}</p>
                <p className="text-xs text-muted-foreground">{investor.email}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${investor.currentValue.toFixed(2)}
                </p>
                <p className={`text-xs ${investor.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {investor.profit >= 0 ? '+' : ''}${investor.profit.toFixed(2)} ({investor.profitPercentage}%)
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Invested: ${investor.invested.toFixed(2)}</span>
              <span>Shares: {investor.shares.toFixed(2)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </CardContent>
</Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invested
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${netInvested.toFixed(2)}</div>
              
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Summary
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
               {formattedDate}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Performance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
             <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
    </div>
    <p className={`text-xs mt-1 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {profitPercentage}% return
    </p>
  </CardContent>
</Card>
  <Card className="mb-8">
  <CardHeader>
    <CardTitle>Update Portfolio Value</CardTitle>
    <CardDescription>
      Enter the current value from your Stake account
    </CardDescription>
  </CardHeader>
  <CardContent>
    <PortfolioUpdateForm />
  </CardContent>
</Card>
        <Card className="mb-8">
  <CardHeader>
    <CardTitle>Add New Investor</CardTitle>
    <CardDescription>
      Create an account for a new investor
    </CardDescription>
  </CardHeader>
  <CardContent>
    <AddInvestorForm />
  </CardContent>
</Card> 
<Card className="mb-8">
  <CardHeader>
    <CardTitle>Record Transaction</CardTitle>
    <CardDescription>
      Record a deposit or withdrawal for an investor
    </CardDescription>
  </CardHeader>
  <CardContent>
    <RecordDepositForm />
  </CardContent>
</Card>
        </div>
 
       
      </main>
    </div>
  );
}
