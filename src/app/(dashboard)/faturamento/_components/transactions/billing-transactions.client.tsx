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
import { BillingTransactionsPagination } from "./billing-transactions-pagination.client";
import { BillingTransactionsFilters } from "./billing-transactions-filters.client";

interface BillingTransactionsClientProps {
  data: BillingTransactionsResponse;
}

export function BillingTransactionsClient({ data }: BillingTransactionsClientProps) {
  const table = useReactTable({
    data: data.transactions,
    columns: billingTransactionsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <BillingTransactionsFilters />
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
                  colSpan={billingTransactionsColumns.length}
                  className="h-24 text-center"
                >
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <BillingTransactionsPagination
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}