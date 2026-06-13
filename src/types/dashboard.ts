import { AppointmentStatus } from "@/generated/prisma/client";

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

export type AppointmentsByStatus = {
  status: AppointmentStatus;
  value: number;
};

export type TopBarberRevenue = {
  barber: string;
  revenue: number;
};

export type TopService = {
  name: string;
  count: number;
};

export type TopBarber = {
  name: string;
  revenue: number;
};