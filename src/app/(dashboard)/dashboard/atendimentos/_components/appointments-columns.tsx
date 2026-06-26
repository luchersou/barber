"use client";

import { ColumnDef } from "@tanstack/react-table";

import { AppointmentStatus } from "@/generated/prisma/client";
import { Appointment } from "@/types/appointments";
import { BarberSelect } from "@/types/barbers";
import { ClientSelect } from "@/types/clients";
import { ServiceSelect } from "@/types/services";

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
  cell: ({ row, table }) => {
      const { barbers, clients, services } = table.options.meta as {
        barbers: BarberSelect[];
        clients: ClientSelect[];
        services: ServiceSelect[];
      };
      return (
        <AppointmentsActions
          appointment={row.original}
          barbers={barbers}
          clients={clients}
          services={services}
        />
      );
    },
  },
];