// User and Auth Types
export type UserRole = "ADMIN" | "INVESTOR";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  image?: string | null;
}

// Portfolio Types
export interface Portfolio {
  id: string;
  name: string;
  description?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Asset Types
export type AssetType = "STOCK" | "ETF" | "CRYPTO" | "BOND" | "MUTUAL_FUND";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: string;
  exchange?: string | null;
  currency: string;
}

// Holding Types
export interface Holding {
  id: string;
  portfolioId: string;
  assetId: string;
  shares: number;
  averageCost: number;
  asset: Asset;
}

// Transaction Types
export type TransactionType = "BUY" | "SELL" | "DIVIDEND" | "SPLIT" | "TRANSFER";

export interface Transaction {
  id: string;
  portfolioId: string;
  assetId: string;
  type: TransactionType;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  fees: number;
  notes?: string | null;
  transactionDate: Date;
  createdAt: Date;
  asset: Asset;
}

// Portfolio Performance Types
export interface PortfolioPerformance {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  todayChange: number;
  todayChangePercentage: number;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalInvestors?: number;
  totalAUM?: number;
  activePortfolios?: number;
  averagePerformance?: number;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AssetAllocation {
  symbol: string;
  name: string;
  value: number;
  percentage: number;
  color?: string;
}
