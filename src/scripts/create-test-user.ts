import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔄 Starting user creation...")
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@test.com" }
    })
    
    if (existingUser) {
      console.log("⚠️  User already exists!")
      console.log("Email: admin@test.com")
      return
    }
    
    // Hash password
    console.log("🔐 Hashing password...")
    const hashedPassword = await bcrypt.hash("admin123", 10)
    console.log("✅ Password hashed")
    
    // Create portfolio WITH user at the same time
    console.log("📁 Creating portfolio with admin user...")
    const portfolio = await prisma.portfolio.create({
      data: {
        name: "Main Portfolio",
        currentValue: 0,
        adminId: "temp",  // Temporary, we'll update
        users: {
          create: {
            email: "admin@test.com",
            name: "Admin",
            password: hashedPassword,
            role: "ADMIN",
          }
        }
      },
      include: {
        users: true
      }
    })
    
    const admin = portfolio.users[0]
    console.log("✅ Portfolio and Admin created")
    
    // Update portfolio with correct adminId
    console.log("🔄 Updating portfolio adminId...")
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { adminId: admin.id }
    })
    console.log("✅ Portfolio updated")
    
    console.log("\n🎉 SUCCESS! Admin user created:")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("📧 Email:    admin@test.com")
    console.log("🔑 Password: admin123")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━")
    
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error)
    prisma.$disconnect()
  })