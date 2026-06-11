import { z } from "zod";

export const createBarberSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().optional(),
});

export type CreateBarberInput = z.infer<typeof createBarberSchema>;