import { pool } from '../../config/database';
import type { AuthUserRecord } from './types';

const SELECT = `
  SELECT
    idusuario,
    login,
    nmusuario,
    senha_hash,
    isativo
  FROM usuario_acesso
`;

export async function findByLogin(login: string): Promise<AuthUserRecord | null> {
  const { rows } = await pool.query(`${SELECT} WHERE login = $1`, [login]);
  return rows[0] ?? null;
}

export async function findById(idusuario: number): Promise<AuthUserRecord | null> {
  const { rows } = await pool.query(`${SELECT} WHERE idusuario = $1`, [idusuario]);
  return rows[0] ?? null;
}