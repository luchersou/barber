import { ServiceSelect } from "@/types/services";
import { prisma } from "@/lib/prisma";

export async function getServices(userId: string): Promise<ServiceSelect[]> {
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