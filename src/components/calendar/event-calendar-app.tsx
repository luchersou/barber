import { getUser } from "@/lib/auth/auth";
import { getCalendarAppointments } from "@/lib/data/calendar-appointment";
import { getClientsForSelect } from "@/lib/data/clients";
import { getBarbers } from "@/lib/data/barbers";
import { getServices } from "@/lib/data/services";
import { EventCalendarApp } from "./event-calendar-app.client";

export async function EventCalendarAppServer() {
  const { userId } = await getUser();

  const [events, clients, barbers, services] = await Promise.all([
    getCalendarAppointments(userId),
    getClientsForSelect(userId),
    getBarbers(userId),
    getServices(userId),
  ]);

  return (
    <EventCalendarApp
      events={events}
      clients={clients}
      barbers={barbers}
      services={services}
    />
  );
}