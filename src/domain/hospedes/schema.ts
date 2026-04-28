import { z } from 'zod';

export const HospedeSchema = z.object({
  id: z.number().optional(),
  idhospede: z.number().optional(),
  idempresa: z.number(),
  nome: z.string(),
  documento: z.string(),
  telefone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  isativo: z.number().optional(),
});

export type Hospede = z.infer<typeof HospedeSchema>;

export type HospedeCreate = Pick<Hospede, 'idempresa' | 'nome' | 'documento' | 'telefone' | 'email'>;
export type HospedeUpdate = Pick<Hospede, 'idhospede' | 'nome' | 'documento' | 'telefone' | 'email'>;
