import { z } from 'zod';

export const ReservaSchema = z.object({
  id: z.number().optional(),
  hospedeId: z.number(),
  quartoId: z.number(),
  dataEntrada: z.string(),
  dataSaida: z.string(),
  status: z.enum(['PENDENTE', 'CONFIRMADA', 'CANCELADA']),
});

export type Reserva = z.infer<typeof ReservaSchema>;