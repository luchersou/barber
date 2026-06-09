import { CalendarEvent, EventColor } from "@/types/calendar";
import { prisma } from "@/lib/prisma";

export async function getCalendarAppointments(userId: string): Promise<CalendarEvent[]> {
  const [appointments, barbers] = await Promise.all([
    prisma.appointment.findMany({
      where: { userId },
      select: {
        id: true,
        date: true,
        status: true,
        notes: true,
        barberId: true,
        client: { select: { name: true } },
        barber: { select: { name: true } },
        services: {
          select: {
            service: { select: { duration: true, name: true } },
          },
        },
      },
    }),
    prisma.barber.findMany({
      where: { userId, active: true },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const barberColors: EventColor[] = ["sky", "amber", "violet", "rose", "emerald", "orange"];
  const barberColorMap: Record<string, EventColor> = {};

  barbers.forEach((barber, index) => {
    barberColorMap[barber.id] = barberColors[index % barberColors.length];
  });

  return appointments.map((a) => {
    const totalDuration = a.services.reduce(
      (acc, s) => acc + s.service.duration,
      0
    );

    return {
      id: a.id,
      title: a.client.name,
      description: `${a.barber.name} · ${a.services.map((s) => s.service.name).join(", ")}`,
      start: a.date,
      end: new Date(a.date.getTime() + totalDuration * 60 * 1000),
      color: barberColorMap[a.barberId] ?? "sky",
      location: `Barbeiro: ${a.barber.name}`,
    };
  });
}