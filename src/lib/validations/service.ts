import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.coerce.number().positive("Preço deve ser maior que zero"),
  duration: z.coerce.number().int().positive("Duração deve ser maior que zero"),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;