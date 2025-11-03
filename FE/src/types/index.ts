export interface User {
  userid: number;
  fullname: string;
  dateofbirth?: string;
  gender?: string;
  phonenumber?: string;
  email: string;
  userName: string;
  role: 'USER' | 'ADMIN';
  uniquecode?: string;
  timezone?: string;
  ispremium?: boolean;
  premiumstart?: string;
  premiumend?: string;
}

export interface Medicine {
  medicineid: number;
  name: string;
  strengthvalue?: number;
  type?: string;
  strengthUnit?: string;
  imageurl?: string;
  notes?: string;
}

export interface DashboardStatistics {
  totalPrescriptions: number;
  activePrescriptions: number;
  totalMedicines: number;
  overallAdherenceRate: number;
  totalIntakesToday: number;
  completedIntakesToday: number;
  missedIntakesToday: number;
  upcomingIntakesToday: number;
  recentActivity?: {
    lastIntakeTime?: string;
    lastMedicineTaken?: string;
    consecutiveDaysCompliant: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Payment Analytics Types
export interface PaymentSummary {
  totalRevenue: number;
  totalTransactions: number;
  paidTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  cancelledTransactions: number;
  averageRevenuePerPaidTransaction: number;
  paidConversionRate: number;
}

export interface PaymentDailyRevenue {
  date: string;
  revenue: number;
  paidTransactions: number;
}

export interface PaymentPlanBreakdown {
  planId: number;
  planName: string;
  revenue: number;
  transactions: number;
  discountPercent?: number;
  revenueShare: number;
}

export interface PaymentStatusBreakdown {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  count: number;
  revenue: number;
  percentage: number;
}

export interface PaymentTopCustomer {
  userId: number;
  fullName?: string;
  email?: string;
  totalSpent: number;
  transactions: number;
  lastPaymentAt?: string;
}

export interface PaymentRecentTransaction {
  paymentId: number;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  transactionId?: string;
  userId: number;
  userFullName?: string;
  userEmail?: string;
  planId: number;
  planName: string;
  createdAt?: string;
  paidAt?: string;
  updatedAt?: string;
}
