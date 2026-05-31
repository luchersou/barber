import { AppointmentStatus } from "@/generated/prisma/client";

export type Appointment = {
  id: string;
  date: Date;
  status: AppointmentStatus;
  totalPrice: number;
  clientName: string;
  barberName: string;
  services: string[];
};

export type AppointmentsResponse = {
  appointments: Appointment[];
  total: number;
  totalPages: number;
  currentPage: number;
};