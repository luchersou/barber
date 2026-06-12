"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth/auth";
import { createClientSchema, CreateClientInput } from "@/lib/validations/client";

/**
 * Revalidates pages affected by client changes.
 */
function revalidateClients() {
  revalidatePath("/clientes");
}

/**
 * Creates a new client.
 */
export async function createClient(
  data: CreateClientInput
) {
  const { userId } = await getUser();

  const validated = createClientSchema.parse(data);

  const client = await prisma.client.create({
    data: {
      userId,
      name: validated.name,
      phone: validated.phone,
      notes: validated.notes,
    },
  });

  revalidateClients();

  return {
    success: true,
    clientId: client.id,
  };
}

/**
 * Updates an existing client.
 */
export async function updateClient(
  id: string,
  data: CreateClientInput
) {
  const { userId } = await getUser();

  const validated = createClientSchema.parse(data);

  await prisma.client.update({
    where: {
      id,
      userId,
    },
    data: {
      name: validated.name,
      phone: validated.phone,
      notes: validated.notes,
    },
  });

  revalidateClients();

  return {
    success: true,
  };
}

/**
 * Deactivates a client while preserving appointment history.
 */
export async function deleteClient(id: string) {
  const { userId } = await getUser();

  await prisma.client.update({
    where: {
      id,
      userId,
    },
    data: {
      active: false,
    },
  });

  revalidateClients();

  return {
    success: true,
  };
}