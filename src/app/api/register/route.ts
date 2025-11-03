import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create portfolio first (with temporary adminId)
    const portfolio = await prisma.portfolio.create({
      data: {
        name: `${name}'s Portfolio`,
        adminId: "temp",
        currentValue: 0
      }
    })
    
    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        portfolioId: portfolio.id
      }
    })
    
    // Update portfolio with real adminId
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { adminId: user.id }
    })
    
    // Create initial transaction for setup
    await prisma.transaction.create({
      data: {
        portfolioId: portfolio.id,
        userId: user.id,
        type: "INITIAL_SETUP",
        amount: 0,
        shares: 0,
        pricePerShare: 1,
        date: new Date(),
        note: "Portfolio initialized"
      }
    })
    
    return NextResponse.json(
      { message: "Account created successfully! Redirecting to login..." },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    )
  }
}