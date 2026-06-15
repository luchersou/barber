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
import { EmptyState } from "@/components/shared/empty-state";
import { Scissors, SearchX } from "lucide-react";

interface BarbersTableClientProps {
  data: BarbersResponse;
  hasFilters: boolean;
}

export function BarbersTableClient({ data, hasFilters }: BarbersTableClientProps) {
  const table = useReactTable({
    data: data.barbers,
    columns: barbersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isEmpty = data.barbers.length === 0;

  return (
    <div className="space-y-4">
      <BarbersFilters />

      {isEmpty ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="Nenhum barbeiro encontrado"
            description="Tente ajustar os filtros para encontrar o que procura."
          />
        ) : (
          <EmptyState
            icon={Scissors}
            title="Nenhum barbeiro cadastrado"
            description="Adicione seu primeiro barbeiro para começar a montar a equipe."
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
          <BarbersPagination
            totalPages={data.totalPages}
            currentPage={data.currentPage}
          />
        </>
      )}
    </div>
  );
}