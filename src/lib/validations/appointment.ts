import { z } from "zod";

import { AppointmentStatus } from "@/generated/prisma/enums";

export const createAppointmentSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  barberId: z.string().min(1, "Selecione um barbeiro"),
  serviceIds: z.array(z.string()).min(1, "Selecione ao menos um serviço"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Selecione uma data"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Selecione um horário"),
  notes: z.string().optional(),
});

export const appointmentDateSchema = createAppointmentSchema.pick({
  date: true,
  time: true,
});

export const appointmentStatusSchema = z.enum(AppointmentStatus);

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;