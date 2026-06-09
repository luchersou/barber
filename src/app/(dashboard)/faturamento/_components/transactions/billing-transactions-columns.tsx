"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BillingTransaction } from "@/types/billing";

export const billingTransactionsColumns: ColumnDef<BillingTransaction>[] = [
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) =>
      new Date(row.getValue("date")).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "clientName",
    header: "Cliente",
  },
  {
    accessorKey: "barberName",
    header: "Barbeiro",
  },
  {
    accessorKey: "services",
    header: "Serviços",
    cell: ({ row }) => {
      const services: string[] = row.getValue("services");
      return services.join(", ");
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Valor",
    cell: ({ row }) => {
      const value: number = row.getValue("totalPrice");
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
];