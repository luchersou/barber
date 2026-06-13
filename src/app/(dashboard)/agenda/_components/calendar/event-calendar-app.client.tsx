"use client";

import { useOptimistic, useTransition } from "react";
import { EventCalendar, type CalendarEvent } from "./";
import { ClientSelect } from "@/types/clients";
import { BarberSelect } from "@/types/barbers";
import { ServiceSelect } from "@/types/services";
import { createAppointment, updateAppointment, updateAppointmentDate, deleteAppointment } from "@/actions/appointment";
import { CreateAppointmentInput } from "@/lib/validations/appointment";
import { toast } from "sonner"; 
import { format } from "date-fns";

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

const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export function EventCalendarApp({
  events: initialEvents,
  clients,
  barbers,
  services,
}: EventCalendarAppProps) {
  const [optimisticEvents, dispatchOptimistic] = useOptimistic(initialEvents, eventsReducer);
  const [, startTransition] = useTransition();

  const handleAppointmentSave = async (data: CreateAppointmentInput & { id?: string }) => {
    const client = clients.find((c) => c.id === data.clientId);
    const barber = barbers.find((b) => b.id === data.barberId);
    const selectedServices = services.filter((s) => data.serviceIds.includes(s.id));
    const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);

    const [hours, minutes] = data.time.split(":").map(Number);
    const start = new Date(data.date);
    start.setHours(hours, minutes, 0, 0);
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
      dispatchOptimistic({ type: "update", event: calendarEvent });
      toast(`Atendimento "${calendarEvent.title}" atualizado`, {
        description: format(start, "dd/MM/yyyy"),
        position: "bottom-left",
      });
    } else {
      const result = await createAppointment(data);
      dispatchOptimistic({ type: "add", event: { ...calendarEvent, id: result.appointmentId } });
      toast(`Atendimento "${calendarEvent.title}" adicionado`, {
        description: format(start, "dd/MM/yyyy"),
        position: "bottom-left",
      });
    }
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    startTransition(async () => {
      dispatchOptimistic({ type: "update", event: updatedEvent });
      const dateStr = updatedEvent.start.toISOString().split("T")[0];
      const timeStr = formatTime(updatedEvent.start);
      await updateAppointmentDate(updatedEvent.id, dateStr, timeStr);
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