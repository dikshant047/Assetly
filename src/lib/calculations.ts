import { prisma } from "@/lib/prisma"

export async function calculateInvestorValues() {
  // Get all data
  const portfolio = await prisma.portfolio.findFirst()
  const allTransactions = await prisma.transaction.findMany({
    include: { user: true }
  })
  const allUsers = await prisma.user.findMany()

  if (!portfolio || allTransactions.length === 0) {
    return []
  }

  // Calculate total shares
  const totalShares = allTransactions.reduce((sum, tx) => {
    return tx.type === 'WITHDRAWAL' 
      ? sum - Number(tx.shares)
      : sum + Number(tx.shares)
  }, 0)

  // Calculate price per share
  const pricePerShare = totalShares > 0 
    ? Number(portfolio.currentValue) / totalShares 
    : 1

  // Calculate each investor's value
  const investorValues = allUsers.map(user => {
    // Get their shares
    const userTransactions = allTransactions.filter(tx => tx.userId === user.id)
    const userShares = userTransactions.reduce((sum, tx) => {
      return tx.type === 'WITHDRAWAL'
        ? sum - Number(tx.shares)
        : sum + Number(tx.shares)
    }, 0)

    // Get their total invested
    const totalInvested = userTransactions
      .filter(tx => tx.type === 'DEPOSIT')
      .reduce((sum, tx) => sum + Number(tx.amount), 0)

    const totalWithdrawn = userTransactions
      .filter(tx => tx.type === 'WITHDRAWAL')
      .reduce((sum, tx) => sum + Number(tx.amount), 0)

    const netInvested = totalInvested - totalWithdrawn

    // Calculate current value
    const currentValue = userShares * pricePerShare

    // Calculate profit
    const profit = currentValue - netInvested
    const profitPercentage = netInvested > 0 
  ? Number(((profit / netInvested) * 100).toFixed(1))
  : 0

    return {
  id: user.id,
  name: user.name,
  email: user.email,
  shares: Number(userShares),
  invested: Number(netInvested),
  currentValue: Number(currentValue),
  profit: Number(profit),
  profitPercentage: netInvested > 0 
    ? Number(((profit / netInvested) * 100).toFixed(1))
    : 0
}
  })

  return investorValues
}