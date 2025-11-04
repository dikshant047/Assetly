import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDatabase() {
  try {
    console.log('🗑️  Starting database reset...')

    // Delete all records in the correct order (respecting foreign keys)
    console.log('Deleting transactions...')
    await prisma.transaction.deleteMany({})

    console.log('Deleting users...')
    await prisma.user.deleteMany({})

    console.log('Deleting portfolios...')
    await prisma.portfolio.deleteMany({})

    console.log('✅ Database reset complete! All data has been cleared.')
  } catch (error) {
    console.error('❌ Error resetting database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

resetDatabase()
