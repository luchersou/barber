export type BillingStats = {
  totalRevenue: number;
  monthRevenue: number;
  averageTicket: number;
  completionRate: number;
};

export type BillingRevenueChart = {
  month: string;
  revenue: number;
};

export type BillingRevenueByBarber = {
  name: string;
  revenue: number;
};

export type BillingRevenueByService = {
  name: string;
  revenue: number;
};

export type BillingTransaction = {
  id: string;
  date: Date;
  totalPrice: number;
  clientName: string;
  barberName: string;
  services: string[];
};

export type BillingTransactionsResponse = {
  transactions: BillingTransaction[];
  total: number;
  totalPages: number;
  currentPage: number;
};