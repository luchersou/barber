import { getUser } from "@/lib/auth/auth";
import { getCalendarAppointments } from "@/lib/data/calendar-appointment";
import { EventCalendarApp } from "./event-calendar-app.client";

export async function EventCalendarAppServer() {
  const { userId } = await getUser();
  const events = await getCalendarAppointments(userId);

  return <EventCalendarApp events={events} />;
}