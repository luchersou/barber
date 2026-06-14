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
import { BarbersResponse } from "@/types/barbers";
import { barbersColumns } from "./barbers-columns";
import { BarbersPagination } from "./barbers-pagination.client";
import { BarbersFilters } from "./barbers-filters.client";

interface BarbersTableClientProps {
  data: BarbersResponse;
}

export function BarbersTableClient({ data }: BarbersTableClientProps) {
  const table = useReactTable({
    data: data.barbers,
    columns: barbersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <BarbersFilters />
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
                  colSpan={barbersColumns.length}
                  className="h-24 text-center"
                >
                  Nenhum barbeiro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <BarbersPagination
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}