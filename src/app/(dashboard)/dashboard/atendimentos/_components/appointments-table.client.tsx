"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentsResponse } from "@/types/appointments";
import { appointmentsColumns } from "./appointments-columns";
import { AppointmentsFilters } from "./appointments-filters.client";
import { BarberSelect } from "@/types/barbers";
import { ClientSelect } from "@/types/clients";
import { ServiceSelect } from "@/types/services";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarX, CalendarSearch } from "lucide-react";
import { TablePagination } from "@/components/shared/pagination";

interface AppointmentsTableClientProps {
  data: AppointmentsResponse;
  barbers: BarberSelect[];
  clients: ClientSelect[];
  services: ServiceSelect[];
  hasFilters: boolean;
}

export function AppointmentsTableClient({ data, barbers, clients, services, hasFilters }: AppointmentsTableClientProps) {
  const table = useReactTable({
    data: data.appointments,
    columns: appointmentsColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: { barbers, clients, services },
  });

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
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            totalPages={data.totalPages}
            currentPage={data.currentPage}
          />
        </>
      )}
    </div>
  );
}