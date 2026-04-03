export type AuthUserRecord = {
  idusuario: number;
  login: string;
  nmusuario: string;
  senha_hash: string;
  isativo: number;
};

export type AuthUser = Omit<AuthUserRecord, 'senha_hash'>;

export type AuthTokenPayload = {
  sub: string;
  login: string;
  nmusuario: string;
};