import { prisma } from "@/lib/prisma"

export async function getPortfolio() {
  const portfolio = await prisma.portfolio.findFirst({
    orderBy: { createdAt: 'asc' }
  })
  
  return portfolio
}
export async function getAllUsers() {
    const investors = await prisma.user.findMany({ 
      orderBy: { createdAt: 'asc' }
    })
    
    return investors
}