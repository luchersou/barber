import { prisma } from "@/lib/prisma";

export async function getServices(userId: string) {
  return prisma.service.findMany({
    where: { userId, active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
    },
  });
}