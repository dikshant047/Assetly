import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete all transactions
  await prisma.transaction.deleteMany({})
  console.log('✅ Deleted all transactions')
  
  // Reset portfolio value
  await prisma.portfolio.updateMany({
    data: {
      currentValue: 0,
      lastUpdated: new Date()
    }
  })
  console.log('✅ Reset portfolio to $0')
  
  console.log('🎉 Database reset complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())