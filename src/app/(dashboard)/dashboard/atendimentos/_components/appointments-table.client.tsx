"use client";

import { AppointmentsResponse } from "@/types/appointments";
import { appointmentsColumns } from "./appointments-columns";
import { AppointmentsFilters } from "./appointments-filters.client";
import { BarberSelect } from "@/types/barbers";
import { ClientSelect } from "@/types/clients";
import { ServiceSelect } from "@/types/services";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarX, CalendarSearch } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";

interface AppointmentsTableClientProps {
  data: AppointmentsResponse;
  barbers: BarberSelect[];
  clients: ClientSelect[];
  services: ServiceSelect[];
  hasFilters: boolean;
}

export function AppointmentsTableClient({ data, barbers, clients, services, hasFilters }: AppointmentsTableClientProps) {
  const isEmpty = data.appointments.length === 0;

  return (
    <div className="space-y-4">
      <AppointmentsFilters barbers={barbers} clients={clients} />

      {isEmpty ? (
        hasFilters ? (
          <EmptyState
            icon={CalendarSearch}
            title="Nenhum atendimento encontrado"
            description="Tente ajustar os filtros para encontrar o que procura."
          />
        ) : (
          <EmptyState
            icon={CalendarX}
            title="Nenhum atendimento cadastrado"
            description="Os agendamentos feitos pela agenda aparecerão aqui."
          />
        )
      ) : (
        <DataTable
          data={data.appointments}
          columns={appointmentsColumns}
          totalPages={data.totalPages}
          currentPage={data.currentPage}
          meta={{ barbers, clients, services }}
        />
      )}
    </div>
  );
}