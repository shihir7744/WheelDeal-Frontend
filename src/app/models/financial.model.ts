export interface FinancialTransaction {
  id: number;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  referenceNumber?: string;
  paymentMethod?: string;
  status: TransactionStatus;
  bookingId?: number;
  carId?: number;
  carBrand?: string;
  carModel?: string;
  userId?: number;
  userFullName?: string;
  branchId?: number;
  branchName?: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export enum TransactionType {
  RENTAL_INCOME = 'RENTAL_INCOME',
  DEPOSIT = 'DEPOSIT',
  LATE_FEE = 'LATE_FEE',
  DAMAGE_FEE = 'DAMAGE_FEE',
  FUEL_FEE = 'FUEL_FEE',
  INSURANCE_FEE = 'INSURANCE_FEE',
  ADDITIONAL_DRIVER_FEE = 'ADDITIONAL_DRIVER_FEE',
  MAINTENANCE_COST = 'MAINTENANCE_COST',
  REPAIR_COST = 'REPAIR_COST',
  REFUND = 'REFUND',
  CANCELLATION_FEE = 'CANCELLATION_FEE',
  ADMINISTRATIVE_FEE = 'ADMINISTRATIVE_FEE',
  TAX = 'TAX',
  DISCOUNT = 'DISCOUNT',
  OTHER_INCOME = 'OTHER_INCOME',
  OTHER_EXPENSE = 'OTHER_EXPENSE'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  DISPUTED = 'DISPUTED',
  PROCESSING = 'PROCESSING'
}

export interface FinancialReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalTransactions: number;
  completedTransactions: number;
  pendingTransactions: number;
  averageTransactionValue: number;
  revenueByType: { [key: string]: number };
  expensesByType: { [key: string]: number };
  revenueByBranch: { [key: string]: number };
  revenueByMonth: { [key: string]: number };
}

export interface TransactionTypeOption {
  value: TransactionType;
  label: string;
  icon: string;
  color: string;
}

export interface TransactionStatusOption {
  value: TransactionStatus;
  label: string;
  color: string;
}

export interface FinancialFilter {
  transactionType?: TransactionType;
  status?: TransactionStatus;
  carId?: number;
  userId?: number;
  branchId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface FinancialStatistics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  transactionCount: number;
  averageTransactionValue: number;
} 