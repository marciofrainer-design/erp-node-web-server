import { gql } from 'apollo-server-express';

export interface AddHospedeArgs {
  nome: string;
  email: string;
}

export interface AddReservaArgs {
  hospedeId: string;
  dataInicio: string;
  dataFim: string;
}

export interface AddCheckinArgs {
  reservaId: string;
  dataCheckIn: string;
  dataCheckOut: string;
}

export const typeDefs = gql`
  type Hospede {
    id: ID!
    nome: String!
    email: String!
  }

  type Reserva {
    id: ID!
    hospedeId: ID!
    dataInicio: String!
    dataFim: String!
  }

  type Checkin {
    id: ID!
    reservaId: ID!
    dataCheckIn: String!
    dataCheckOut: String!
  }

  type Query {
    hospedes: [Hospede!]!
    reservas: [Reserva!]!
    checkins: [Checkin!]!
  }

  type Mutation {
    addHospede(nome: String!, email: String!): Hospede!
    addReserva(hospedeId: ID!, dataInicio: String!, dataFim: String!): Reserva!
    addCheckin(reservaId: ID!, dataCheckIn: String!, dataCheckOut: String!): Checkin!
  }
`;

