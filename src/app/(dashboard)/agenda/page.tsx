import { Suspense } from "react";
import { EventCalendarAppServer } from "./_components/calendar/event-calendar-app";

export default function AgendaPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Agenda</h1>
        <p className="text-muted-foreground">
          Gerencie os agendamentos da barbearia.
        </p>
      </div>
      <Suspense fallback={<div>Carregando...</div>}>
        <EventCalendarAppServer />
      </Suspense>
    </div>
  );
}