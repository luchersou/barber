import { prisma } from "@/lib/prisma";

export async function getServices(userId: string) {
  return prisma.service.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
    },
  });
}