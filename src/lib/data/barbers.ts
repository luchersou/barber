import { prisma } from "@/lib/prisma";

export async function getBarbers(userId: string) {
  return prisma.barber.findMany({
    where: { userId, active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}