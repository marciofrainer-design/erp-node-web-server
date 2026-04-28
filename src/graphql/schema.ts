import { gql } from 'apollo-server-express';

export interface HospedesArgs { idempresa?: number; }
export interface HospedeByIdArgs { id: string; }

export interface AddHospedeArgs {
  idempresa: number;
  nome: string;
  documento: string;
  telefone?: string;
  email?: string;
}
export interface UpdateHospedeArgs {
  id: string;
  nome?: string;
  documento?: string;
  telefone?: string;
  email?: string;
}

export interface ReservasArgs { idempresa?: number; }
export interface ReservaByIdArgs { id: string; }

export interface AddReservaArgs {
  idempresa: number;
  idhospede: number;
  iduh: number;
  dataentrada: string;
  datasaida: string;
  status?: string;
}
export interface UpdateReservaArgs {
  id: string;
  status: string;
}

export interface CheckinsArgs { idreserva?: number; }
export interface CheckinByIdArgs { id: string; }

export interface AddCheckinArgs {
  idreserva: number;
  datacheckin?: string;
  datacheckout?: string;
  status?: string;
}
export interface UpdateCheckinArgs {
  id: string;
  datacheckin?: string;
  datacheckout?: string;
  status?: string;
}

export const typeDefs = gql`
  type Hospede {
    id: ID!
    idhospede: Int!
    idempresa: Int!
    nome: String!
    documento: String!
    telefone: String
    email: String
    isativo: Int!
  }

  type Reserva {
    id: ID!
    idreserva: Int!
    idempresa: Int!
    idhospede: Int!
    iduh: Int!
    dataentrada: String!
    datasaida: String!
    status: String!
    isativo: Int!
  }

  type Checkin {
    id: ID!
    idcheckin: Int!
    idreserva: Int!
    datacheckin: String
    datacheckout: String
    status: String!
  }

  type Query {
    hospedes(idempresa: Int): [Hospede!]!
    hospede(id: ID!): Hospede
    reservas(idempresa: Int): [Reserva!]!
    reserva(id: ID!): Reserva
    checkins(idreserva: Int): [Checkin!]!
    checkin(id: ID!): Checkin
  }

  type Mutation {
    addHospede(idempresa: Int!, nome: String!, documento: String!, telefone: String, email: String): Hospede!
    updateHospede(id: ID!, nome: String, documento: String, telefone: String, email: String): Hospede
    deleteHospede(id: ID!): Boolean!

    addReserva(idempresa: Int!, idhospede: Int!, iduh: Int!, dataentrada: String!, datasaida: String!, status: String): Reserva!
    updateReserva(id: ID!, status: String!): Reserva
    deleteReserva(id: ID!): Boolean!

    addCheckin(idreserva: Int!, datacheckin: String, datacheckout: String, status: String): Checkin!
    updateCheckin(id: ID!, datacheckin: String, datacheckout: String, status: String): Checkin
    deleteCheckin(id: ID!): Boolean!
  }
`;

