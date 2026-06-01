"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Appointment } from "@/types/appointments";
import { AppointmentStatus } from "@/generated/prisma/client";
import { AppointmentsActions } from "./appointments-actions.client";

const statusLabels: Record<AppointmentStatus, string> = {
  SCHEDULED: "Agendado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  NO_SHOW: "Não compareceu",
};

export const appointmentsColumns: ColumnDef<Appointment>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: AppointmentStatus = row.getValue("status");
      return statusLabels[status];
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => {
      const value: number = row.getValue("totalPrice");
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <AppointmentsActions appointment={row.original} />,
  },
];