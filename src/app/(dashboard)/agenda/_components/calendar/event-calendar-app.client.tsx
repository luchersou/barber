"use client";

import { useOptimistic, useTransition } from "react";
import { EventCalendar, type CalendarEvent } from "./";
import { ClientSelect } from "@/types/clients";
import { BarberSelect } from "@/types/barbers";
import { ServiceSelect } from "@/types/services";

interface EventCalendarAppProps {
  events: CalendarEvent[];
  clients: ClientSelect[];
  barbers: BarberSelect[];
  services: ServiceSelect[];
}

type CalendarAction =
  | { type: "add"; event: CalendarEvent }
  | { type: "update"; event: CalendarEvent }
  | { type: "delete"; eventId: string };

function eventsReducer(state: CalendarEvent[], action: CalendarAction): CalendarEvent[] {
  switch (action.type) {
    case "add":
      return [...state, action.event];
    case "update":
      return state.map((e) => (e.id === action.event.id ? action.event : e));
    case "delete":
      return state.filter((e) => e.id !== action.eventId);
  }
}

export function EventCalendarApp({
  events: initialEvents,
  clients,
  barbers,
  services,
}: EventCalendarAppProps) {
  const [optimisticEvents, dispatchOptimistic] = useOptimistic(initialEvents, eventsReducer);
  const [, startTransition] = useTransition();

  const handleEventAdd = (event: CalendarEvent) => {
    startTransition(async () => {
      dispatchOptimistic({ type: "add", event });
      // TODO: await createAppointment(event)
    });
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    startTransition(async () => {
      dispatchOptimistic({ type: "update", event: updatedEvent });
      // TODO: await updateAppointment(updatedEvent)
    });
  };

  const handleEventDelete = (eventId: string) => {
    startTransition(async () => {
      dispatchOptimistic({ type: "delete", eventId });
      // TODO: await deleteAppointment(eventId)
    });
  };

  return (
    <EventCalendar
      events={optimisticEvents}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      clients={clients}
      barbers={barbers}
      services={services}
    />
  );
}