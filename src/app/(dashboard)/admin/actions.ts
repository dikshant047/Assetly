"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import{ z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
    value: z.string()
    .min(1, "Value is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, {
        message: "Value must be a valid number",
    }),
});

 
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
       const amountString = formData.get("amount") as string;
        const amount = parseFloat(amountString);
        const userId = formData.get("userId") as string;  
        const dateString = formData.get("date") as string;
        const date = new Date(dateString);
        const noteString = formData.get("note") as string;
        
        console.log("🔵 Received amount:", amount);
        console.log("🔵 Received userId:", userId);
        console.log("🔵 Received date:", date);
        console.log("🔵 Received note:", noteString);
        
    if (isNaN(amount) || amount <= 0) {
      console.log("🔴 Invalid amount");
      return { message: "Please enter a valid positive amount." };
    }
    
    const allTransactions = await prisma.transaction.findMany()

const portfolio = await prisma.portfolio.findFirst();
if (!portfolio) {
  console.log("🔴 No portfolio found");
  return { message: "Portfolio not found." };
}  console.log("🟡 FormData entries for deposit:")

const totalShares = allTransactions.reduce((sum, tx) => {
  return tx.type === 'WITHDRAWAL' 
    ? sum - Number(tx.shares)
    : sum + Number(tx.shares)
}, 0)
 

let price: number
let sharesForTransaction: number

if (totalShares === 0) {
  price = 1
  const calculatedShares = amount
  // Make negative for withdrawal
  sharesForTransaction = type === "WITHDRAWAL" ? -calculatedShares : calculatedShares
} else {
  price = Number(portfolio.currentValue) / totalShares
  const calculatedShares = amount / price
  // Make negative for withdrawal
  sharesForTransaction = type === "WITHDRAWAL" ? -calculatedShares : calculatedShares
}
     
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.log("🔴 User not found");
      return { message: "User not found." };
    }
 
    await prisma.transaction.create({
  data: {
    portfolioId: portfolio.id,     // ← Add this
    userId: user.id,
    type: type as "DEPOSIT" | "WITHDRAWAL" | "INITIAL_SETUP",  // ✅ Type assertion
    amount: amount,
    shares: sharesForTransaction,       // ← Add this (calculate first!)
    pricePerShare: price,           // ← Add this (calculate first!)
    date: date,
    note: noteString || null
  }
})
  const newValue = type === "WITHDRAWAL"
  ? Number(portfolio.currentValue) - amount  // Subtract for withdrawal
  : Number(portfolio.currentValue) + amount  // Add for deposit

await prisma.portfolio.update({
  where: { id: portfolio.id },
  data: {
    currentValue: newValue,
    lastUpdated: new Date()
  }
}) 
    console.log("✅ Deposit recorded:", amount);
    revalidatePath("/admin");
    return { message: `${type === "DEPOSIT" ? "Deposit" : "Withdrawal"} recorded successfully!` }
    

    
  } 
  catch (error) {
    console.log("🔴 Caught error:", error);

  return { message: "An error occurred while recording deposit." }
  }
}

export async function getUsersList() {
    const users = await prisma.user.findMany({ 
      orderBy: { createdAt: 'asc' }
    })
    
    return users
}