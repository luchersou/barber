"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth/auth";
import { getAppointmentById } from "@/lib/data/appointments";
import { prisma } from "@/lib/prisma";
import { CreateAppointmentInput,createAppointmentSchema } from "@/lib/validations/appointment";

/**
 * Validates appointment data, ensures related entities exist,
 * and prepares the data required for creation or update operations.
 */
async function buildAppointmentData(
  data: CreateAppointmentInput,
  userId: string
) {
  const result = createAppointmentSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Dados inválidos");
  }

  const validated = result.data;

  const appointmentDate = new Date(`${validated.date}T${validated.time}:00`);

  const [client, barber, services] = await Promise.all([
    prisma.client.findFirst({
      where: {
        id: validated.clientId,
        userId,
      },
      select: { id: true },
    }),

    prisma.barber.findFirst({
      where: {
        id: validated.barberId,
        userId,
      },
      select: { id: true },
    }),

    prisma.service.findMany({
      where: {
        id: {
          in: validated.serviceIds,
        },
        userId,
      },
      select: {
        id: true,
        price: true,
      },
    }),
  ]);

  if (!client) {
    throw new Error("Cliente não encontrado");
  }

  if (!barber) {
    throw new Error("Barbeiro não encontrado");
  }

  if (services.length !== validated.serviceIds.length) {
    throw new Error("Um ou mais serviços são inválidos");
  }

  const totalPrice = services.reduce(
    (sum, service) => sum + Number(service.price),
    0
  );

  return {
    validated,
    appointmentDate,
    services,
    totalPrice,
  };
}


/**
 * Revalidates pages affected by appointment changes.
 */
function revalidateAppointments() {
  revalidatePath("/agenda");
  revalidatePath("/atendimentos");
}


/**
 * Creates a new appointment and associates the selected services.
 */
export async function createAppointment(data: CreateAppointmentInput) {
  const { userId } = await getUser();

  const {
    validated,
    appointmentDate,
    services,
    totalPrice,
  } = await buildAppointmentData(data, userId);

  const appointment = await prisma.appointment.create({
    data: {
      userId,
      clientId: validated.clientId,
      barberId: validated.barberId,
      date: appointmentDate,
      notes: validated.notes,
      totalPrice,

      services: {
        create: services.map((service) => ({
          serviceId: service.id,
          price: service.price,
        })),
      },
    },
  });

  revalidateAppointments();

  return {
    success: true,
    appointmentId: appointment.id,
  };
}

/**
 * Updates an existing appointment and replaces its associated services.
 */
export async function updateAppointment(
  id: string,
  data: CreateAppointmentInput
) {
  const { userId } = await getUser();

  const {
    validated,
    appointmentDate,
    services,
    totalPrice,
  } = await buildAppointmentData(data, userId);

  await prisma.appointment.update({
    where: {
      id,
      userId,
    },
    data: {
      clientId: validated.clientId,
      barberId: validated.barberId,
      date: appointmentDate,
      notes: validated.notes,
      totalPrice,

      services: {
        deleteMany: {},
        create: services.map((service) => ({
          serviceId: service.id,
          price: service.price,
        })),
      },
    },
  });

  revalidateAppointments();

  return {
    success: true,
  };
}

/**
 * Deletes an appointment and its related services within a transaction
 * to ensure data consistency.
 */
export async function deleteAppointment(id: string) {
  const { userId } = await getUser();

  await prisma.$transaction([
    prisma.appointmentService.deleteMany({
      where: {
        appointmentId: id,
      },
    }),

    prisma.appointment.delete({
      where: {
        id,
        userId,
      },
    }),
  ]);

  revalidateAppointments();

  return {
    success: true,
  };
}

/**
 * Updates only the date and time of an existing appointment.
 */
export async function updateAppointmentDate(id: string, date: string, time: string) {
  const { userId } = await getUser();

  const [hours, minutes] = time.split(":").map(Number);
  const appointmentDate = new Date(`${date}T${time}:00`);
  appointmentDate.setHours(hours, minutes, 0, 0);

  await prisma.appointment.update({
    where: { id, userId },
    data: { date: appointmentDate },
  });

  revalidateAppointments();

  return { success: true };
}

export async function getAppointmentByIdAction(id: string) {
  const { userId } = await getUser();
  return getAppointmentById(id, userId);
}