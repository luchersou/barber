import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@/generated/prisma/client";
import { BillingRevenueByBarber, BillingRevenueByService, BillingRevenueChart, BillingStats, BillingTransactionsResponse } from "@/types/billing";
import { fromZonedTime } from "date-fns-tz";

const BILLING_TRANSACTIONS_PER_PAGE = 10;

export async function getBillingStats(userId: string): Promise<BillingStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const [
    totalRevenue,
    monthRevenue,
    totalCompleted,
    lastMonthRevenue,
    lastMonthCompleted,
    lastMonthTotal,
  ] = await Promise.all([
    prisma.appointment.aggregate({
      where: { userId, status: AppointmentStatus.COMPLETED },
      _sum: { totalPrice: true },
    }),

    prisma.appointment.aggregate({
      where: {
        userId,
        status: AppointmentStatus.COMPLETED,
        date: { gte: startOfMonth },
      },
      _sum: { totalPrice: true },
    }),

    prisma.appointment.count({
      where: { userId, status: AppointmentStatus.COMPLETED },
    }),

    prisma.appointment.aggregate({
      where: {
        userId,
        status: AppointmentStatus.COMPLETED,
        date: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { totalPrice: true },
    }),

    prisma.appointment.count({
      where: {
        userId,
        status: AppointmentStatus.COMPLETED,
        date: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),

    prisma.appointment.count({
      where: {
        userId,
        date: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
  ]);

  const totalRevenueValue = Number(totalRevenue._sum.totalPrice ?? 0);
  const monthRevenueValue = Number(monthRevenue._sum.totalPrice ?? 0);
  const averageTicket = totalCompleted > 0 ? totalRevenueValue / totalCompleted : 0;

  const totalAppointments = await prisma.appointment.count({ where: { userId } });
  const completionRate = totalAppointments > 0
    ? Math.round((totalCompleted / totalAppointments) * 100)
    : 0;

  const lastMonthRevenueValue = Number(lastMonthRevenue._sum.totalPrice ?? 0);
  const lastMonthCompletionRate = lastMonthTotal > 0
    ? Math.round((lastMonthCompleted / lastMonthTotal) * 100)
    : 0;

  return {
    totalRevenue: totalRevenueValue,
    monthRevenue: monthRevenueValue,
    averageTicket,
    completionRate,
    lastMonth: {
      monthRevenue: lastMonthRevenueValue,
      completionRate: lastMonthCompletionRate,
    },
  };
}

export async function getBillingRevenueChart(userId: string): Promise<BillingRevenueChart[]> {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
      status: AppointmentStatus.COMPLETED,
      date: { gte: twelveMonthsAgo },
    },
    select: {
      date: true,
      totalPrice: true,
    },
  });

  const revenueMap: Record<string, number> = {};

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const key = d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
    revenueMap[key] = 0;
  }

  for (const appointment of appointments) {
    const key = appointment.date.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    });
    if (key in revenueMap) {
      revenueMap[key] += Number(appointment.totalPrice);
    }
  }

  return Object.entries(revenueMap).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

export async function getBillingRevenueByBarber(userId: string): Promise<BillingRevenueByBarber[]> {
  const result = await prisma.appointment.groupBy({
    by: ["barberId"],
    where: {
      userId,
      status: AppointmentStatus.COMPLETED,
    },
    _sum: { totalPrice: true },
    orderBy: { _sum: { totalPrice: "desc" } },
  });

  const barberIds = result.map((item) => item.barberId);

  const barbers = await prisma.barber.findMany({
    where: { id: { in: barberIds } },
    select: { id: true, name: true },
  });

  const barberMap = Object.fromEntries(barbers.map((b) => [b.id, b.name]));

  return result.map((item) => ({
    name: barberMap[item.barberId] ?? item.barberId,
    revenue: Number(item._sum.totalPrice ?? 0),
  }));
}

export async function getBillingRevenueByService(userId: string): Promise<BillingRevenueByService[]> {
  const result = await prisma.appointmentService.groupBy({
    by: ["serviceId"],
    where: {
      appointment: {
        userId,
        status: AppointmentStatus.COMPLETED,
      },
    },
    _sum: { price: true },
    orderBy: { _sum: { price: "desc" } },
  });

  const serviceIds = result.map((item) => item.serviceId);

  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
    select: { id: true, name: true },
  });

  const serviceMap = Object.fromEntries(services.map((s) => [s.id, s.name]));

  return result.map((item) => ({
    name: serviceMap[item.serviceId] ?? item.serviceId,
    revenue: Number(item._sum.price ?? 0),
  }));
}

export async function getBillingTransactions(
  userId: string,
  params: {
    page?: number;
    startDate?: string;
    endDate?: string;
    timezone?: string;
  }
): Promise<BillingTransactionsResponse> {
  const { page = 1, startDate, endDate, timezone = "UTC" } = params;
  console.log("startDate:", startDate, "endDate:", endDate, "timezone:", timezone);

  const where = {
    userId,
    status: AppointmentStatus.COMPLETED,
    ...(startDate || endDate
      ? {
          date: {
            ...(startDate && {
              gte: fromZonedTime(
                `${startDate.split("T")[0]}T00:00:00`,
                timezone
              ),
            }),
            ...(endDate && {
              lte: fromZonedTime(
                `${endDate.split("T")[0]}T23:59:59.999`,
                timezone
              ),
            }),
          },
        }
      : {}),
  };

  const [transactions, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      skip: (page - 1) * BILLING_TRANSACTIONS_PER_PAGE,
      take: BILLING_TRANSACTIONS_PER_PAGE,
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        totalPrice: true,
        client: { select: { name: true } },
        barber: { select: { name: true } },
        services: {
          select: {
            service: { select: { name: true } },
          },
        },
      },
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    transactions: transactions.map((t) => ({
      id: t.id,
      date: t.date,
      totalPrice: Number(t.totalPrice),
      clientName: t.client.name,
      barberName: t.barber.name,
      services: t.services.map((s) => s.service.name),
    })),
    total,
    totalPages: Math.ceil(total / BILLING_TRANSACTIONS_PER_PAGE),
    currentPage: page,
  };
}