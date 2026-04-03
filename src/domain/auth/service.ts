import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as repo from './repository';
import type { AuthTokenPayload, AuthUser } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn'];

export class AuthenticationError extends Error {}

function sanitizeUser(user: Awaited<ReturnType<typeof repo.findByLogin>>): AuthUser {
  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  const { senha_hash: _senhaHash, ...safeUser } = user;
  return safeUser;
}

export async function login(loginValue: string, password: string) {
  const user = await repo.findByLogin(loginValue);
  if (!user || user.isativo !== 1) {
    throw new AuthenticationError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.senha_hash);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid credentials');
  }

  const safeUser = sanitizeUser(user);
  const token = jwt.sign(
    {
      login: safeUser.login,
      nmusuario: safeUser.nmusuario,
    },
    JWT_SECRET,
    {
      subject: String(safeUser.idusuario),
      expiresIn: JWT_EXPIRES_IN,
    },
  );

  return {
    token,
    user: safeUser,
  };
}

export async function getCurrentUser(idusuario: number): Promise<AuthUser | null> {
  const user = await repo.findById(idusuario);
  if (!user || user.isativo !== 1) {
    return null;
  }

  return sanitizeUser(user);
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

  return {
    sub: String(decoded.sub),
    login: String(decoded.login),
    nmusuario: String(decoded.nmusuario),
  };
}