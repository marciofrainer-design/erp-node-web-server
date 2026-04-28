import { z } from 'zod';

export const ReservaSchema = z.object({
  id: z.number().optional(),
  idreserva: z.number().optional(),
  idempresa: z.number(),
  idhospede: z.number(),
  iduh: z.number(),
  dataentrada: z.string(),
  datasaida: z.string(),
  status: z.enum(['PENDENTE', 'CONFIRMADA', 'CANCELADA']),
  isativo: z.number().optional(),
});

export type Reserva = z.infer<typeof ReservaSchema>;

export type ReservaCreate = Pick<Reserva, 'idempresa' | 'idhospede' | 'iduh' | 'dataentrada' | 'datasaida' | 'status'>;
export type ReservaUpdate = Pick<Reserva, 'idreserva' | 'status'>;
