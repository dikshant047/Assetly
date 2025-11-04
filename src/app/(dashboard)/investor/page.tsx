import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Activity,
  Wallet
} from "lucide-react";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/logout_button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function InvestorDashboard() {
  const session = await auth();

  // Ensure user is logged in
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Redirect admin to admin page
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  // Get the logged-in user's data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    redirect("/login");
  }

  // Check if user has been assigned to a portfolio
  if (!user.portfolioId) {
    return (
      <div className="min-h-screen bg-background p-8">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Investor Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome, {user.name}
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Not Assigned</CardTitle>
              <CardDescription>
                Your account has been created successfully. Please contact your administrator to be assigned to a portfolio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Once assigned, you'll be able to view your investments, transactions, and performance metrics here.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Get portfolio data
  const portfolio = await prisma.portfolio.findUnique({
    where: { id: user.portfolioId }
  });

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background p-8">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Investor Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome, {user.name}
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Not Found</CardTitle>
              <CardDescription>
                There was an error loading your portfolio. Please contact support.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    );
  }

  // Get all transactions for this user
  const userTransactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' }
  });

  // Get all transactions to calculate total shares and price
  const allTransactions = await prisma.transaction.findMany();

  // Calculate total shares in the portfolio
  const totalShares = allTransactions.reduce((sum, tx) => {
    return tx.type === 'WITHDRAWAL'
      ? sum - Number(tx.shares)
      : sum + Number(tx.shares)
  }, 0);

  // Calculate current price per share
  const pricePerShare = totalShares > 0
    ? Number(portfolio.currentValue) / totalShares
    : 1;

  // Calculate user's shares
  const userShares = userTransactions.reduce((sum, tx) => {
    return tx.type === 'WITHDRAWAL'
      ? sum - Number(tx.shares)
      : sum + Number(tx.shares)
  }, 0);

  // Calculate user's invested amount (deposits - withdrawals)
  const totalDeposited = userTransactions
    .filter(tx => tx.type === 'DEPOSIT')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalWithdrawn = userTransactions
    .filter(tx => tx.type === 'WITHDRAWAL')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const netInvested = totalDeposited - totalWithdrawn;

  // Calculate current value
  const currentValue = userShares * pricePerShare;

  // Calculate profit/loss
  const profit = currentValue - netInvested;
  const profitPercentage = netInvested > 0
    ? ((profit / netInvested) * 100).toFixed(1)
    : "0.0";

  // Format last updated date
  const formattedDate = portfolio?.lastUpdated
    ? new Date(portfolio.lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Never';

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Investor Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back, {user.name}
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Value
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userShares.toFixed(2)} shares @ ${pricePerShare.toFixed(4)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Invested
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${netInvested.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Deposited: ${totalDeposited.toFixed(2)} | Withdrawn: ${totalWithdrawn.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profit/Loss
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
              </div>
              <p className={`text-xs mt-1 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitPercentage}% return
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Updated
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> {formattedDate}</div>
               
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Your deposit and withdrawal history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions yet</p>
            ) : (
              <div className="space-y-4">
                {userTransactions.map((tx) => (
                  <div key={tx.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        {tx.note && (
                          <p className="text-xs text-muted-foreground mt-1">{tx.note}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'DEPOSIT' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.type === 'DEPOSIT' ? '+' : '-'}{Number(tx.shares).toFixed(2)} shares
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @ ${Number(tx.pricePerShare).toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}