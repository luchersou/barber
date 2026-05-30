import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@/generated/prisma/client";
import { DashboardStats, RevenueChart, TopBarber, TopService } from "@/types/dashboard";

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalClients, monthAppointments, monthRevenue, completedThisMonth] =
    await Promise.all([
      prisma.client.count(),

      prisma.appointment.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      }),

      prisma.appointment.aggregate({
        where: {
          status: AppointmentStatus.COMPLETED,
          createdAt: { gte: startOfMonth },
        },
        _sum: { totalPrice: true },
      }),

      prisma.appointment.count({
        where: {
          status: AppointmentStatus.COMPLETED,
          createdAt: { gte: startOfMonth },
        },
      }),
    ]);

  return {
    totalClients,
    monthAppointments,
    monthRevenue: Number(monthRevenue._sum.totalPrice ?? 0),
    completedThisMonth,
  };
}

export async function getRevenueChart(userId: string): Promise<RevenueChart[]> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const appointments = await prisma.appointment.findMany({
    where: {
      status: AppointmentStatus.COMPLETED,
      date: { gte: thirtyDaysAgo },
    },
    select: {
      date: true,
      totalPrice: true,
    },
  });

  const revenueMap: Record<string, number> = {};

  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(thirtyDaysAgo.getDate() + i);
    const key = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    revenueMap[key] = 0;
  }

  for (const appointment of appointments) {
    const key = appointment.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    if (key in revenueMap) {
      revenueMap[key] += Number(appointment.totalPrice);
    }
  }

  return Object.entries(revenueMap).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}

export async function getAppointmentsByStatus(userId: string) {
  const result = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return result.map((item) => ({
    status: item.status,
    value: item._count.status,
  }));
}

export async function getTopServices(userId: string): Promise<TopService[]> {
  const result = await prisma.appointmentService.groupBy({
    by: ["serviceId"],
    _count: { serviceId: true },
    orderBy: { _count: { serviceId: "desc" } },
    take: 5,
  });

  const serviceIds = result.map((item) => item.serviceId);

  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
    select: { id: true, name: true },
  });

  const serviceMap = Object.fromEntries(services.map((s) => [s.id, s.name]));

  return result.map((item) => ({
    name: serviceMap[item.serviceId] ?? item.serviceId,
    count: item._count.serviceId,
  }));
}

export async function getTopBarbers(userId: string): Promise<TopBarber[]> {
  const result = await prisma.appointment.groupBy({
    by: ["barberId"],
    where: { status: AppointmentStatus.COMPLETED },
    _sum: { totalPrice: true },
    orderBy: { _sum: { totalPrice: "desc" } },
    take: 5,
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