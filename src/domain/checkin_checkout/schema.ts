import { z } from 'zod';

export const CheckInCheckOutSchema = z.object({
  id: z.number().optional(),
  reservaId: z.number(),
  dataCheckIn: z.string().optional(),
  dataCheckOut: z.string().optional(),
  status: z.enum(['PENDENTE', 'CHECKED_IN', 'CHECKED_OUT']),
});

export type CheckInCheckOut = z.infer<typeof CheckInCheckOutSchema>;