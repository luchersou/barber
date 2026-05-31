import { AppointmentStatus } from "@/generated/prisma/client";

export type Client = {
  id: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  lastAppointmentDate: Date | null;
  lastAppointmentStatus: AppointmentStatus | null;
  totalSpent: number;
};

export type ClientsResponse = {
  clients: Client[];
  total: number;
  totalPages: number;
  currentPage: number;
};

export type ClientSelect = {
  id: string;
  name: string;
};