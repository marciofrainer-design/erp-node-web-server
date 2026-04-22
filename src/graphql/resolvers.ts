import { IResolvers } from "@graphql-tools/utils";
import { AddCheckinArgs, AddHospedeArgs, AddReservaArgs } from "./schema";
import { databaseFactory } from "../config/database.factory";

export const resolvers: IResolvers = {
  Query: {
    user: async () => {
      return databaseFactory
        .getPool()
        .query("SELECT * FROM users WHERE id = $1", [1])
        .then((res) => res.rows[0]);
    },
    uh: async () => {
      // Fetch uh from database
    },
    uhTipos: async () => {
      // Fetch uhTipos from database
    },
    edificacoes: async () => {
      // Fetch edificacoes from database
    },
    andares: async () => {
      // Fetch andares from database
    },
    uhcaracteristicas: async () => {
      // Fetch uhcaracteristicas from database
    },
    hospedes: async () => {
      // Fetch hospedes from database
    },
    reservas: async () => {
      // Fetch reservas from database
    },
    checkins: async () => {
      // Fetch checkins from database
    },
  },
  Mutation: {
    addHospede: async (_: unknown, { nome, email }: AddHospedeArgs) => {
      // Add hospede to database
    },
    addReserva: async (
      _: unknown,
      { hospedeId, dataInicio, dataFim }: AddReservaArgs,
    ) => {
      // Add reserva to database
    },
    addCheckin: async (
      _: unknown,
      { reservaId, dataCheckIn, dataCheckOut }: AddCheckinArgs,
    ) => {
      // Add checkin to database
    },
  },
};
