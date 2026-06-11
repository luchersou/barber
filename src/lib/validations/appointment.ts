import { z } from "zod";

export const createAppointmentSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  barberId: z.string().min(1, "Selecione um barbeiro"),
  serviceIds: z.array(z.string()).min(1, "Selecione ao menos um serviço"),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;