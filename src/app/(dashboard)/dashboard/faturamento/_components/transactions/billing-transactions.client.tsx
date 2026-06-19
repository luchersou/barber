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
import { BillingTransactionsResponse } from "@/types/billing";
import { billingTransactionsColumns } from "./billing-transactions-columns";
import { BillingTransactionsFilters } from "./billing-transactions-filters.client";
import { EmptyState } from "@/components/shared/empty-state";
import { Receipt, SearchX } from "lucide-react";
import { TablePagination } from "@/components/shared/pagination";

interface BillingTransactionsClientProps {
  data: BillingTransactionsResponse;
  hasFilters: boolean;
}

export function BillingTransactionsClient({ data, hasFilters }: BillingTransactionsClientProps) {
  const table = useReactTable({
    data: data.transactions,
    columns: billingTransactionsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isEmpty = data.transactions.length === 0;

  return (
    <div className="space-y-4">
      <BillingTransactionsFilters />

      {isEmpty ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="Nenhuma transação encontrada"
            description="Tente ajustar os filtros para encontrar o que procura."
          />
        ) : (
          <EmptyState
            icon={Receipt}
            title="Nenhuma transação registrada"
            description="As transações aparecerão aqui conforme os atendimentos forem concluídos."
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