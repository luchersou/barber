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
import { AppointmentsPagination } from "./appointments-pagination.client";
import { AppointmentsFilters } from "./appointments-filters.client";
import { BarberSelect } from "@/types/barbers";
import { ClientSelect } from "@/types/clients";

interface AppointmentsTableClientProps {
  data: AppointmentsResponse;
  barbers: BarberSelect[];
  clients: ClientSelect[];
}

export function AppointmentsTableClient({ data, barbers, clients }: AppointmentsTableClientProps) {
  const table = useReactTable({
    data: data.appointments,
    columns: appointmentsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <AppointmentsFilters barbers={barbers} clients={clients} />
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={appointmentsColumns.length}
                  className="h-24 text-center"
                >
                  Nenhum atendimento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AppointmentsPagination
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}