import { AppointmentStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ClientSelect,ClientsResponse } from "@/types/clients";

const CLIENTS_PER_PAGE = 10;

export async function getClients(
  userId: string,
  params: {
    page?: number;
    search?: string;
    active?: boolean;
  }
): Promise<ClientsResponse> {
  const { page = 1, search, active } = params;

  const where = {
    userId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(active !== undefined && { active }),
  };

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip: (page - 1) * CLIENTS_PER_PAGE,
      take: CLIENTS_PER_PAGE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        notes: true,
        active: true,
        createdAt: true,
        appointments: {
          orderBy: { date: "desc" },
          take: 1,
          select: {
            date: true,
            status: true,
          },
        },
      },
    }),

    prisma.client.count({ where }),
  ]);

  const totals = await prisma.appointment.groupBy({
    by: ["clientId"],
    where: {
      userId,
      status: AppointmentStatus.COMPLETED,
      clientId: { in: clients.map((c) => c.id) },
    },
    _sum: { totalPrice: true },
  });

  const totalSpentMap = Object.fromEntries(
    totals.map((t) => [t.clientId, Number(t._sum.totalPrice ?? 0)])
  );

  return {
    clients: clients.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      notes: c.notes,
      active: c.active,
      createdAt: c.createdAt,
      lastAppointmentDate: c.appointments[0]?.date ?? null,
      lastAppointmentStatus: c.appointments[0]?.status ?? null,
      totalSpent: totalSpentMap[c.id] ?? 0,
    })),
    total,
    totalPages: Math.ceil(total / CLIENTS_PER_PAGE),
    currentPage: page,
  };
}

export async function getClientsForSelect(userId: string): Promise<ClientSelect[]> {
  return prisma.client.findMany({
    where: { userId, active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}