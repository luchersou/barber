export type DashboardStats = {
  totalClients: number;
  monthAppointments: number;
  monthRevenue: number;
  completedThisMonth: number;
};

export type RevenueChart = {
  date: string;
  revenue: number;
};

export type TopBarberRevenue = {
  barber: string;
  revenue: number;
};

export type TopService = {
  name: string;
  count: number;
};