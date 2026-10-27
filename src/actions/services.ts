"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { CreateServiceInput,createServiceSchema } from "@/lib/validations/service";

/**
 * Revalidates pages affected by service changes.
 */
function revalidateServices() {
  revalidatePath("/dashboard/servicos");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/atendimentos");
}

/**
 * Ensures no other active service of the user already uses this name.
 */
async function assertServiceNameAvailable(
  userId: string,
  name: string,
  ignoreId?: string
) {
  const existingService = await prisma.service.findFirst({
    where: {
      userId,
      name,
      active: true,
      ...(ignoreId && { NOT: { id: ignoreId } }),
    },
    select: { id: true },
  });

  if (existingService) {
    throw new Error("Já existe um serviço com esse nome");
  }
}

/**
 * Creates a new service.
 */
export async function createService(
  data: CreateServiceInput
) {
  const { userId } = await getUser();

  const validated = createServiceSchema.parse(data);

  await assertServiceNameAvailable(userId, validated.name);

  const service = await prisma.service.create({
    data: {
      userId,
      name: validated.name,
      price: validated.price,
      duration: validated.duration,
    },
  });

  revalidateServices();

  return {
    success: true,
    serviceId: service.id,
  };
}

/**
 * Updates an existing service.
 */
export async function updateService(
  id: string,
  data: CreateServiceInput
) {
  const { userId } = await getUser();

  const validated = createServiceSchema.parse(data);

  await assertServiceNameAvailable(userId, validated.name, id);

  await prisma.service.update({
    where: {
      id,
      userId,
    },
    data: {
      name: validated.name,
      price: validated.price,
      duration: validated.duration,
    },
  });

  revalidateServices();

  return {
    success: true,
  };
}

/**
 * Deactivates a service while preserving appointment history.
 */
export async function deleteService(id: string) {
  const { userId } = await getUser();

  await prisma.service.update({
    where: {
      id,
      userId,
    },
    data: {
      active: false,
    },
  });

  revalidateServices();

  return {
    success: true,
  };
}