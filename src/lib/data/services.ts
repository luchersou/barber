import { ServiceSelect, ServicesResponse } from "@/types/services";
import { prisma } from "@/lib/prisma";

const SERVICES_PER_PAGE = 10;

export async function getServicesForSelect(userId: string): Promise<ServiceSelect[]> {
  const services = await prisma.service.findMany({
    where: { userId, active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
    },
  });

  return services.map((s) => ({
    ...s,
    price: Number(s.price),
  }));
}

export async function getServicesTable(
  userId: string,
  params: {
    page?: number;
    search?: string;
    active?: boolean;
  }
): Promise<ServicesResponse> {
  const { page = 1, search, active } = params;

  const where = {
    userId,
    ...(search && {
      name: { contains: search, mode: "insensitive" as const },
    }),
    ...(active !== undefined && { active }),
  };

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip: (page - 1) * SERVICES_PER_PAGE,
      take: SERVICES_PER_PAGE,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        active: true,
      },
    }),
    prisma.service.count({ where }),
  ]);

  return {
    services: services.map((s) => ({
      id: s.id,
      name: s.name,
      price: Number(s.price),
      duration: s.duration,
      active: s.active,
    })),
    total,
    totalPages: Math.ceil(total / SERVICES_PER_PAGE),
    currentPage: page,
  };
}