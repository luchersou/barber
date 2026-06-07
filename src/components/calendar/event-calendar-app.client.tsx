"use client";

import { useState } from "react";
import { EventCalendar, type CalendarEvent } from "./";

interface EventCalendarAppProps {
  events: CalendarEvent[];
}

export function EventCalendarApp({ events: initialEvents }: EventCalendarAppProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
}