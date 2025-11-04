"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

 
export async function updatePortfolioValue(
  prevState: { message: string } | undefined,
  formData: FormData
): Promise<{ message: string }> {
  try {
    console.log("🟡 FormData entries:")
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`)
    }

    const valueString = formData.get("Value") as string;
    console.log("🔵 Received value:", valueString);

    const valueNumber = parseFloat(valueString);
    console.log("🔵 Parsed number:", valueNumber);
    if(isNaN(valueNumber) || valueNumber < 0) {
        console.log("🔴 Invalid number");
        return { message: "Please enter a valid non-negative number." };
    }

    const portfolio = await prisma.portfolio.findFirst();
    if (!portfolio) {
      console.log("🔴 No portfolio found");
      return { message: "Portfolio not found." };
    }
    console.log("found portfolio", portfolio.id);
    await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: { currentValue: valueNumber, lastUpdated: new Date() }
    })
console.log("✅ Portfolio updated with value:", valueNumber);
    revalidatePath("/admin");
    return { message: "Portfolio value updated successfully." };
     
  } catch (error) { 
    console.log("🔴 Caught error:", error);
  return { message: "An error occurred while updating." };
  }
}

export async function createInvestor(
    prevState: { message: string } | undefined,
    formData: FormData
  ): Promise<{ message: string }> {
    try{
        console.log("🟡 FormData entries for investor creation:")
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const portfolio = await prisma.portfolio.findFirst()
       

        console.log("🔵 Received name:", name);
        console.log("🔵 Received email:", email);
        console.log("🔵 Received password length:", password?.length);
      
        if (!portfolio) {
             return { message: "Portfolio not found" }
            }

        if(!name || !email || !password) {
            console.log("🔴 Missing fields");
            return { message: "All fields are required." };
        }
        
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            console.log("🔴 User already exists with email:", email);
            return { message: "User with this email already exists." };
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "INVESTOR",
                portfolioId: portfolio.id,
            }
        });

        console.log("✅ Investor created:", email);
revalidatePath("/admin")
return { message: "Investor created successfully." }
        

    
    }
    catch(error){
        console.log("🔴 Caught error:", error);
        return { message: "An error occurred while creating investor." };
    }

}

export async function recordTransaction(
  prevState: { message: string } | undefined,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const type = formData.get("type") as string
    const amountString = formData.get("amount") as string
    const amount = parseFloat(amountString)
    const userId = formData.get("userId") as string
    const dateString = formData.get("date") as string
    const date = new Date(dateString)
    const noteString = formData.get("note") as string

    console.log("🔵 Type:", type)
    console.log("🔵 Amount:", amount)
    console.log("🔵 User:", userId)

    if (isNaN(amount) || amount <= 0) {
      return { message: "Please enter a valid positive amount." }
    }

    // Get portfolio FIRST
    const portfolio = await prisma.portfolio.findFirst()
    if (!portfolio) {
      return { message: "Portfolio not found." }
    }

    // Get all transactions
    const allTransactions = await prisma.transaction.findMany()

    // Calculate CURRENT total shares
    // Shares are stored as POSITIVE values, type determines add/subtract
    const totalShares = allTransactions.reduce((sum, tx) => {
      return tx.type === 'WITHDRAWAL'
        ? sum - Number(tx.shares)  // Subtract for withdrawals
        : sum + Number(tx.shares)  // Add for deposits
    }, 0)

    console.log("📊 Total shares:", totalShares)
    console.log("📊 Current portfolio:", Number(portfolio.currentValue))

    // If withdrawal, check if user has enough invested
    if (type === "WITHDRAWAL") {
      const userTransactions = allTransactions.filter(tx => tx.userId === userId)
      const userTotalInvested = userTransactions
        .filter(tx => tx.type === 'DEPOSIT')
        .reduce((sum, tx) => sum + Number(tx.amount), 0)
      const userTotalWithdrawn = userTransactions
        .filter(tx => tx.type === 'WITHDRAWAL')
        .reduce((sum, tx) => sum + Number(tx.amount), 0)
      const userNetInvested = userTotalInvested - userTotalWithdrawn

      console.log("💰 User net invested:", userNetInvested)
      console.log("💸 Withdrawal amount:", amount)

      // Check if withdrawal would make net invested negative
      if (amount > userNetInvested + 0.01) { // Add small buffer for rounding
        return { message: `Cannot withdraw more than invested. Current net investment: $${userNetInvested.toFixed(2)}` }
      }
    }

    // Calculate price and shares
    let price: number
    let sharesForTransaction: number

    if (totalShares === 0) {
      // First ever deposit
      price = 1
      sharesForTransaction = amount
    } else if (type === "DEPOSIT") {
      // New deposit: use CURRENT portfolio value
      price = Number(portfolio.currentValue) / totalShares
      sharesForTransaction = amount / price
      console.log("💰 Deposit - Price per share:", price)
      console.log("📈 Adding shares:", sharesForTransaction)
    } else {
      // WITHDRAWAL: use CURRENT portfolio value BEFORE withdrawal
      // Store POSITIVE shares value - calculations.ts will handle subtraction based on type
      price = Number(portfolio.currentValue) / totalShares
      sharesForTransaction = amount / price  // POSITIVE - let type determine direction
      console.log("💰 Withdrawal - Price per share:", price)
      console.log("📉 Removing shares:", sharesForTransaction)
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { message: "User not found." }
    }

    // Create transaction
    await prisma.transaction.create({
      data: {
        portfolioId: portfolio.id,
        userId: user.id,
        type: type as "DEPOSIT" | "WITHDRAWAL",
        amount: amount,
        shares: sharesForTransaction,
        pricePerShare: price,
        date: date,
        note: noteString || null
      }
    })

    // Update portfolio value
    const newValue = type === "WITHDRAWAL"
      ? Math.max(0, Number(portfolio.currentValue) - amount)  // Prevent negative portfolio value
      : Number(portfolio.currentValue) + amount

    console.log("💵 New portfolio value:", newValue)

    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        currentValue: newValue,
        lastUpdated: new Date()
      }
    })

    console.log(`✅ ${type} recorded: ${amount}`)
    revalidatePath("/admin")
    return { message: `${type === "DEPOSIT" ? "Deposit" : "Withdrawal"} recorded successfully!` }

  } catch (error) {
    console.log("🔴 Error:", error)
    return { message: "An error occurred." }
  }
}

export async function getUsersList() {
    const users = await prisma.user.findMany({ 
      orderBy: { createdAt: 'asc' }
    })
    
    return users
}