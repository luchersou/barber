"use client";

import { ColumnDef } from "@tanstack/react-table";

import { AppointmentStatus } from "@/generated/prisma/enums";
import { APP_TIMEZONE } from "@/lib/constants/app";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/constants/appointment";
import { Client } from "@/types/clients";

import { ClientsActions } from "./clients-actions.client";

export const clientsColumns: ColumnDef<Client>[] = [
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
    accessorKey: "createdAt",
    header: "Cadastrado em",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt")).toLocaleDateString("pt-BR", {
        timeZone: APP_TIMEZONE,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  {
    accessorKey: "lastAppointmentDate",
    header: "Último atendimento",
    cell: ({ row }) => {
      const date: Date | null = row.getValue("lastAppointmentDate");
      return date
        ? new Date(date).toLocaleDateString("pt-BR", {
            timeZone: APP_TIMEZONE,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "—";
    },
  },
  {
    accessorKey: "lastAppointmentStatus",
    header: "Status",
    cell: ({ row }) => {
      const status: AppointmentStatus | null = row.getValue("lastAppointmentStatus");
      return status ? APPOINTMENT_STATUS_LABELS[status] : "—";
    },
  },
  {
    accessorKey: "totalSpent",
    header: "Total gasto",
    cell: ({ row }) => {
      const value: number = row.getValue("totalSpent");
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ClientsActions client={row.original} />,
  },
];