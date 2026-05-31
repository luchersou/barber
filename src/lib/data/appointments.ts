import { prisma } from "@/lib/prisma";
import { AppointmentsResponse } from "@/types/appointments";

const APPOINTMENTS_PER_PAGE = 10;

export async function getAppointments(
  userId: string,
  params: {
    page?: number;
    barberId?: string;
    clientId?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<AppointmentsResponse> {
  const { page = 1, barberId, clientId, startDate, endDate } = params;

  const where = {
    userId,
    ...(barberId && { barberId }),
    ...(clientId && { clientId }),
    ...(startDate || endDate
      ? {
          date: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      : {}),
  };

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      skip: (page - 1) * APPOINTMENTS_PER_PAGE,
      take: APPOINTMENTS_PER_PAGE,
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        status: true,
        totalPrice: true,
        client: { select: { name: true } },
        barber: { select: { name: true } },
        services: {
          select: {
            service: { select: { name: true } },
          },
        },
      },
    }),

    prisma.appointment.count({ where }),
  ]);

  return {
    appointments: appointments.map((a) => ({
      id: a.id,
      date: a.date,
      status: a.status,
      totalPrice: Number(a.totalPrice),
      clientName: a.client.name,
      barberName: a.barber.name,
      services: a.services.map((s) => s.service.name),
    })),
    total,
    totalPages: Math.ceil(total / APPOINTMENTS_PER_PAGE),
    currentPage: page,
  };
}