import { z } from 'zod';

export const CheckInCheckOutSchema = z.object({
  id: z.number().optional(),
  idcheckin: z.number().optional(),
  idreserva: z.number(),
  datacheckin: z.string().nullable().optional(),
  datacheckout: z.string().nullable().optional(),
  status: z.enum(['PENDENTE', 'CHECKED_IN', 'CHECKED_OUT']),
});

export type CheckInCheckOut = z.infer<typeof CheckInCheckOutSchema>;

export type CheckInCreate = Pick<CheckInCheckOut, 'idreserva' | 'datacheckin' | 'datacheckout' | 'status'>;
export type CheckInUpdate = Pick<CheckInCheckOut, 'idcheckin' | 'datacheckin' | 'datacheckout' | 'status'>;
