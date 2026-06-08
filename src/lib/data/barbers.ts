import { prisma } from "@/lib/prisma";
import { BarbersResponse } from "@/types/barbers";

const BARBERS_PER_PAGE = 10;

export async function getBarbersForSelect(userId: string) {
  return prisma.barber.findMany({
    where: { userId, active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getBarbersTable(
  userId: string,
  params: {
    page?: number;
    search?: string;
    active?: boolean;
  }
): Promise<BarbersResponse> {
  const { page = 1, search, active } = params;

  const where = {
    userId,
    ...(search && {
      name: { contains: search, mode: "insensitive" as const },
    }),
    ...(active !== undefined && { active }),
  };

  const [barbers, total] = await Promise.all([
    prisma.barber.findMany({
      where,
      skip: (page - 1) * BARBERS_PER_PAGE,
      take: BARBERS_PER_PAGE,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        phone: true,
        active: true,
      },
    }),
    prisma.barber.count({ where }),
  ]);

  return {
    barbers,
    total,
    totalPages: Math.ceil(total / BARBERS_PER_PAGE),
    currentPage: page,
  };
}