import { z } from 'zod';

export const AndarSchema = z.object({
  id: z.number().optional(),
  idandar: z.number(),
  idempresa: z.number(),
  nmempresa: z.string(),
  cdandar: z.string(),
  nmandar: z.string(),
  isativo: z.number(),
});

export type Andar = z.infer<typeof AndarSchema>;