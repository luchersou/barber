import { startOfDay, subDays } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

import { AppointmentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { AppointmentsByStatus, DashboardStats, RevenueChart, TopBarberRevenue, TopService } from "@/types/dashboard";

import { getMonthDateRanges } from "../date-ranges";

const REVENUE_CHART_DAYS = 30;

export async function getDashboardStats(userId: string, timezone: string = "UTC"): Promise<DashboardStats> {
  const { startOfMonth, startOfLastMonth, equivalentEndOfLastMonth } = getMonthDateRanges(timezone);

  const [
    totalClients,
    monthAppointments,
    monthRevenue,
    completedThisMonth,
    lastMonthAppointments,
    lastMonthRevenue,
    completedLastMonth,
  ] = await Promise.all([
    prisma.client.count({ where: { userId } }),

    prisma.appointment.count({
      where: { userId, date: { gte: startOfMonth } },
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
      where: {
        userId,
        status: AppointmentStatus.COMPLETED,
        date: { gte: startOfMonth },
      },
    }),

    prisma.appointment.count({
      where: {
        userId,
        date: { gte: startOfLastMonth, lte: equivalentEndOfLastMonth },
      },
    }),

    prisma.appointment.aggregate({
      where: {
        userId,
        status: AppointmentStatus.COMPLETED,
        date: { gte: startOfLastMonth, lte: equivalentEndOfLastMonth },
      },
      _sum: { totalPrice: true },
    }),

    prisma.appointment.count({
      where: {
        userId,
        status: AppointmentStatus.COMPLETED,
        date: { gte: startOfLastMonth, lte: equivalentEndOfLastMonth },
      },
    }),
  ]);

  return {
    totalClients,
    monthAppointments,
    monthRevenue: Number(monthRevenue._sum.totalPrice ?? 0),
    completedThisMonth,
    lastMonth: {
      monthAppointments: lastMonthAppointments,
      monthRevenue: Number(lastMonthRevenue._sum.totalPrice ?? 0),
      completedThisMonth: completedLastMonth,
    },
  };
}

export async function getRevenueChart(userId: string, timezone: string = "UTC"): Promise<RevenueChart[]> {
  const now = new Date();
  const startDate = startOfDay(subDays(toZonedTime(now, timezone), REVENUE_CHART_DAYS - 1));
  const startDateUTC = fromZonedTime(startDate, timezone);

  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
      status: AppointmentStatus.COMPLETED,
      date: { gte: startDateUTC },
    },
    select: {
      date: true,
      totalPrice: true,
    },
  });

  const revenueMap: Record<string, number> = {};

  for (let i = 0; i < REVENUE_CHART_DAYS; i++) {
    const d = toZonedTime(
      fromZonedTime(subDays(startDate, -i), timezone),
      timezone
    );
    const key = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    revenueMap[key] = 0;
  }

  for (const appointment of appointments) {
    const d = toZonedTime(appointment.date, timezone);
    const key = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (key in revenueMap) {
      revenueMap[key] += Number(appointment.totalPrice);
    }
  }

  return Object.entries(revenueMap)
    .sort(([a], [b]) => {
      const [dayA, monthA] = a.split("/").map(Number);
      const [dayB, monthB] = b.split("/").map(Number);
      if (monthA !== monthB) return monthA - monthB;
      return dayA - dayB;
    })
    .map(([date, revenue]) => ({ date, revenue }));
}

export async function getAppointmentsByStatus(userId: string): Promise<AppointmentsByStatus[]> {
  const result = await prisma.appointment.groupBy({
    by: ["status"],
    where: { userId },
    _count: { status: true },
  });

  return result.map((item) => ({
    status: item.status,
    value: item._count.status,
  }));
}

export async function getTopBarbersByRevenue(userId: string): Promise<TopBarberRevenue[]> {
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
    barber: barberMap[item.barberId] ?? item.barberId,
    revenue: Number(item._sum.totalPrice ?? 0),
  }));
}


export async function getTopServices(userId: string): Promise<TopService[]> {
  const result = await prisma.appointmentService.groupBy({
    by: ["serviceId"],
    where: {
      appointment: {
        userId,
        status: AppointmentStatus.COMPLETED,
      },
    },
    _count: { serviceId: true },
    orderBy: { _count: { serviceId: "desc" } },
    take: 5,
  });

  const serviceIds = result.map((item) => item.serviceId);

  const services = await prisma.service.findMany({
    where: { userId, id: { in: serviceIds } },
    select: { id: true, name: true },
  });

  const serviceMap = Object.fromEntries(services.map((s) => [s.id, s.name]));

  return result.map((item) => ({
    name: serviceMap[item.serviceId] ?? item.serviceId,
    count: item._count.serviceId,
  }));
}