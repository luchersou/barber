"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { BarberTable } from "@/types/barbers";
import { BarbersActions } from "./barbers-actions.client";

export const barbersColumns: ColumnDef<BarberTable>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => row.getValue("phone") ?? "—",
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
    cell: ({ row }) => <BarbersActions barber={row.original} />,
  },
];