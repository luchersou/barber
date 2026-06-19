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
import { ClientsResponse } from "@/types/clients";
import { clientsColumns } from "./clients-columns";
import { TablePagination } from "@/components/shared/pagination";
import { ClientsFilters } from "./clients-filters.client";
import { EmptyState } from "@/components/shared/empty-state";
import { Users, SearchX } from "lucide-react";

interface ClientsTableClientProps {
  data: ClientsResponse;
  hasFilters: boolean;
}

export function ClientsTableClient({ data, hasFilters }: ClientsTableClientProps) {
  const table = useReactTable({
    data: data.clients,
    columns: clientsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isEmpty = data.clients.length === 0;

  return (
    <div className="space-y-4">
      <ClientsFilters />

      {isEmpty ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="Nenhum cliente encontrado"
            description="Tente ajustar os filtros para encontrar o que procura."
          />
        ) : (
          <EmptyState
            icon={Users}
            title="Nenhum cliente cadastrado"
            description="Adicione seu primeiro cliente para começar a gerenciar os atendimentos."
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