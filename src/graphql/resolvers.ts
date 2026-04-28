import { IResolvers } from '@graphql-tools/utils';
import type {
  HospedesArgs, HospedeByIdArgs,
  AddHospedeArgs, UpdateHospedeArgs,
  ReservasArgs, ReservaByIdArgs,
  AddReservaArgs, UpdateReservaArgs,
  CheckinsArgs, CheckinByIdArgs,
  AddCheckinArgs, UpdateCheckinArgs,
} from './schema';
import * as hospedeRepo from '../domain/hospedes/repository';
import * as reservaRepo from '../domain/reservas/repository';
import * as checkinRepo from '../domain/checkin_checkout/repository';

export const resolvers: IResolvers = {
  Query: {
    hospedes: (_: unknown, { idempresa }: HospedesArgs) =>
      hospedeRepo.getAll(idempresa),

    hospede: (_: unknown, { id }: HospedeByIdArgs) =>
      hospedeRepo.getById(Number(id)),

    reservas: (_: unknown, { idempresa }: ReservasArgs) =>
      reservaRepo.getAll(idempresa),

    reserva: (_: unknown, { id }: ReservaByIdArgs) =>
      reservaRepo.getById(Number(id)),

    checkins: (_: unknown, { idreserva }: CheckinsArgs) =>
      checkinRepo.getAll(idreserva),

    checkin: (_: unknown, { id }: CheckinByIdArgs) =>
      checkinRepo.getById(Number(id)),
  },

  Mutation: {
    addHospede: (_: unknown, args: AddHospedeArgs) =>
      hospedeRepo.post(args),

    updateHospede: (_: unknown, { id, ...data }: UpdateHospedeArgs) =>
      hospedeRepo.put({ ...data, idhospede: Number(id) } as Parameters<typeof hospedeRepo.put>[0]),

    deleteHospede: async (_: unknown, { id }: HospedeByIdArgs) => {
      await hospedeRepo.deleteById(Number(id));
      return true;
    },

    addReserva: (_: unknown, args: AddReservaArgs) =>
      reservaRepo.post(args as Parameters<typeof reservaRepo.post>[0]),

    updateReserva: (_: unknown, { id, status }: UpdateReservaArgs) =>
      reservaRepo.put({ idreserva: Number(id), status } as Parameters<typeof reservaRepo.put>[0]),

    deleteReserva: async (_: unknown, { id }: ReservaByIdArgs) => {
      await reservaRepo.deleteById(Number(id));
      return true;
    },

    addCheckin: (_: unknown, args: AddCheckinArgs) =>
      checkinRepo.post(args as Parameters<typeof checkinRepo.post>[0]),

    updateCheckin: (_: unknown, { id, ...data }: UpdateCheckinArgs) =>
      checkinRepo.put({ ...data, idcheckin: Number(id) } as Parameters<typeof checkinRepo.put>[0]),

    deleteCheckin: async (_: unknown, { id }: CheckinByIdArgs) => {
      await checkinRepo.deleteById(Number(id));
      return true;
    },
  },
};

