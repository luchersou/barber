"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { CreateBarberInput,createBarberSchema } from "@/lib/validations/barber";

/**
 * Revalidates pages affected by barber changes.
 */
function revalidateBarbers() {
  revalidatePath("/barbeiros");
}

/**
 * Creates a new barber.
 */
export async function createBarber(
  data: CreateBarberInput
) {
  const { userId } = await getUser();

  const validated = createBarberSchema.parse(data);

  const barber = await prisma.barber.create({
    data: {
      userId,
      name: validated.name,
      phone: validated.phone,
    },
  });

  revalidateBarbers();

  return {
    success: true,
    barberId: barber.id,
  };
}

/**
 * Updates an existing barber.
 */
export async function updateBarber(
  id: string,
  data: CreateBarberInput
) {
  const { userId } = await getUser();

  const validated = createBarberSchema.parse(data);

  await prisma.barber.update({
    where: {
      id,
      userId,
    },
    data: {
      name: validated.name,
      phone: validated.phone,
    },
  });

  revalidateBarbers();

  return {
    success: true,
  };
}

/**
 * Deactivates a barber while preserving appointment history.
 */
export async function deleteBarber(id: string) {
  const { userId } = await getUser();

  await prisma.barber.update({
    where: {
      id,
      userId,
    },
    data: {
      active: false,
    },
  });

  revalidateBarbers();

  return {
    success: true,
  };
}