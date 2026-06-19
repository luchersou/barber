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
import { ServicesResponse } from "@/types/services";
import { servicesColumns } from "./services-columns";
import { ServicesFilters } from "./services-filters.client";
import { EmptyState } from "@/components/shared/empty-state";
import { Sparkles, SearchX } from "lucide-react";
import { TablePagination } from "@/components/shared/pagination";

interface ServicesTableClientProps {
  data: ServicesResponse;
  hasFilters: boolean;
}

export function ServicesTableClient({ data, hasFilters }: ServicesTableClientProps) {
  const table = useReactTable({
    data: data.services,
    columns: servicesColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isEmpty = data.services.length === 0;

  return (
    <div className="space-y-4">
      <ServicesFilters />

      {isEmpty ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="Nenhum serviço encontrado"
            description="Tente ajustar os filtros para encontrar o que procura."
          />
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Nenhum serviço cadastrado"
            description="Adicione seu primeiro serviço para começar a montar o catálogo da barbearia."
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