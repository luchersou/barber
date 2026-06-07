"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ServiceTable } from "@/types/services";
import { ServicesActions } from "./services-actions.client";

export const servicesColumns: ColumnDef<ServiceTable>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => {
      const value: number = row.getValue("price");
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    accessorKey: "duration",
    header: "Duração",
    cell: ({ row }) => {
      const minutes: number = row.getValue("duration");
      return `${minutes} min`;
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active: boolean = row.getValue("active");
      return (
        <Badge variant={active ? "default" : "secondary"}>
          {active ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ServicesActions service={row.original} />,
  },
];