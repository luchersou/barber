import { getUser } from "@/lib/auth/auth";
import { getCalendarAppointments } from "@/lib/data/calendar-appointment";
import { getClientsForSelect } from "@/lib/data/clients";
import { getBarbersForSelect } from "@/lib/data/barbers";
import { getServicesForSelect } from "@/lib/data/services";
import { EventCalendarApp } from "./event-calendar-app.client";

export async function EventCalendarAppServer() {
  const { userId } = await getUser();

  const [events, clients, barbers, services] = await Promise.all([
    getCalendarAppointments(userId),
    getClientsForSelect(userId),
    getBarbersForSelect(userId),
    getServicesForSelect(userId),
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