import { CalendarEvent, EventColor } from "@/types/calendar";
import { AppointmentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getCalendarAppointments(userId: string): Promise<CalendarEvent[]> {
  const appointments = await prisma.appointment.findMany({
    where: { userId },
    select: {
      id: true,
      date: true,
      status: true,
      notes: true,
      client: { select: { name: true } },
      barber: { select: { name: true } },
      services: {
        select: {
          service: { select: { duration: true, name: true } },
        },
      },
    },
  });

  return appointments.map((a) => {
    const totalDuration = a.services.reduce(
      (acc, s) => acc + s.service.duration,
      0
    );

    const statusColor: Record<AppointmentStatus, EventColor> = {
      SCHEDULED: "sky",
      COMPLETED: "emerald",
      CANCELLED: "rose",
      NO_SHOW: "amber",
    };

    return {
      id: a.id,
      title: a.client.name,
      description: `${a.barber.name} · ${a.services.map((s) => s.service.name).join(", ")}`,
      start: a.date,
      end: new Date(a.date.getTime() + totalDuration * 60 * 1000),
      color: statusColor[a.status],
      location: a.barber.name, // Generic field from CalendarEvent, used to display the barber
    };
  });
}