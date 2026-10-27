"use client";

import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner"; 

import { createAppointment, deleteAppointment,updateAppointment, updateAppointmentDate } from "@/actions/appointment";
import { toAppointmentDateParts } from "@/lib/appointment-date";
import { APP_TIMEZONE } from "@/lib/constants/app";
import { CreateAppointmentInput } from "@/lib/validations/appointment";
import { BarberSelect } from "@/types/barbers";
import { ClientSelect } from "@/types/clients";
import { ServiceSelect } from "@/types/services";

import { type CalendarEvent,EventCalendar } from "./";

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
  const localEvents = initialEvents.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  const [optimisticEvents, dispatchOptimistic] = useOptimistic(localEvents, eventsReducer);
  const [, startTransition] = useTransition();

  const handleAppointmentSave = async (data: CreateAppointmentInput & { id?: string }) => {
    const client = clients.find((c) => c.id === data.clientId);
    const barber = barbers.find((b) => b.id === data.barberId);
    const selectedServices = services.filter((s) => data.serviceIds.includes(s.id));
    const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);

    const start = fromZonedTime(`${data.date}T${data.time}:00`, APP_TIMEZONE);
    const end = new Date(start.getTime() + totalDuration * 60 * 1000);

    const calendarEvent: CalendarEvent = {
      id: data.id ?? "",
      title: client?.name ?? "",
      description: `${barber?.name} · ${selectedServices.map((s) => s.name).join(", ")}`,
      start,
      end,
      color: "sky",
      location: `Barbeiro: ${barber?.name}`,
    };

    if (data.id) {
      await updateAppointment(data.id, data);

      dispatchOptimistic({
        type: "update",
        event: calendarEvent,
      });

      toast.success(`Atendimento "${calendarEvent.title}" atualizado`, {
        description: format(start, "dd/MM/yyyy"),
      });
    } else {
      const result = await createAppointment(data);

      dispatchOptimistic({
        type: "add",
        event: {
          ...calendarEvent,
          id: result.appointmentId,
        },
      });

      toast.success(`Atendimento "${calendarEvent.title}" adicionado`, {
        description: format(start, "dd/MM/yyyy"),
      });
    }
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    startTransition(async () => {
      dispatchOptimistic({ type: "update", event: updatedEvent });
      const { date, time } = toAppointmentDateParts(updatedEvent.start);
      await updateAppointmentDate(updatedEvent.id, date, time);
    });
  };

  const handleEventDelete = (eventId: string) => {
    startTransition(async () => {
      dispatchOptimistic({ type: "delete", eventId });
      await deleteAppointment(eventId);
    });
  };

  return (
    <EventCalendar
      events={optimisticEvents}
      onEventSave={handleAppointmentSave}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      clients={clients}
      barbers={barbers}
      services={services}
    />
  );
}