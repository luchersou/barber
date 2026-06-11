import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;