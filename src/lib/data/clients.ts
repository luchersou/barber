import { prisma } from "@/lib/prisma";
import { ClientsResponse, ClientSelect } from "@/types/clients";

const CLIENTS_PER_PAGE = 10;

export async function getClients(
  userId: string,
  params: {
    page?: number;
    search?: string;
  }
): Promise<ClientsResponse> {
  const { page = 1, search } = params;

  const where = {
    userId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } },
      ],
    }),
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
        createdAt: true,
        appointments: {
          orderBy: { date: "desc" },
          take: 1,
          select: {
            date: true,
            status: true,
            totalPrice: true,
          },
        },
      },
    }),

    prisma.client.count({ where }),
  ]);

  return {
    clients: clients.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      createdAt: c.createdAt,
      lastAppointmentDate: c.appointments[0]?.date ?? null,
      lastAppointmentStatus: c.appointments[0]?.status ?? null,
      totalSpent: Number(c.appointments[0]?.totalPrice ?? 0),
    })),
    total,
    totalPages: Math.ceil(total / CLIENTS_PER_PAGE),
    currentPage: page,
  };
}

export async function getClientsForSelect(userId: string): Promise<ClientSelect[]> {
  return prisma.client.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}