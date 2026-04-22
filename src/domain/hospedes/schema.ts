import { z } from 'zod';

export const HospedeSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  documento: z.string(),
  telefone: z.string(),
  email: z.string().email(),
});

export type Hospede = z.infer<typeof HospedeSchema>;