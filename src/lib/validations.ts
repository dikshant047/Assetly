import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Portfolio schemas
export const createPortfolioSchema = z.object({
  name: z.string().min(2, "Portfolio name must be at least 2 characters"),
  description: z.string().optional(),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();

// Transaction schemas
export const createTransactionSchema = z.object({
  portfolioId: z.string().cuid("Invalid portfolio ID"),
  assetId: z.string().cuid("Invalid asset ID"),
  type: z.enum(["BUY", "SELL", "DIVIDEND", "SPLIT", "TRANSFER"]),
  shares: z.number().positive("Shares must be positive"),
  pricePerShare: z.number().positive("Price must be positive"),
  fees: z.number().nonnegative("Fees cannot be negative").default(0),
  notes: z.string().optional(),
  transactionDate: z.date(),
});

// Asset schemas
export const createAssetSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long"),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  exchange: z.string().optional(),
  currency: z.string().default("USD"),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type CreateAssetInput = z.infer<typeof createAssetSchema>;
