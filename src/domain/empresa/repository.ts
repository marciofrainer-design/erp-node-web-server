import { pool } from '../../config/database';
import type { Empresa } from './types';

const SELECT =
  'SELECT idempresa AS id, idempresa, nmfantasia, cnpj, isativo FROM empresa';

export async function getAll(): Promise<Empresa[]> {
  const { rows } = await pool.query(`${SELECT} ORDER BY nmfantasia`);
  return rows;
}

export async function getById(id: number): Promise<Empresa | null> {
  const { rows } = await pool.query(`${SELECT} WHERE idempresa = $1`, [id]);
  return rows[0] ?? null;
}

export async function save(
  data: Pick<Empresa, 'nmfantasia' | 'cnpj' | 'isativo'>,
): Promise<Empresa> {
  const { rows } = await pool.query(
    `INSERT INTO empresa (nmfantasia, cnpj, isativo)
     VALUES ($1, $2, $3)
     RETURNING idempresa AS id, idempresa, nmfantasia, cnpj, isativo`,
    [data.nmfantasia, data.cnpj, data.isativo],
  );
  return rows[0];
}

export async function update(data: Empresa): Promise<Empresa | null> {
  const { rows } = await pool.query(
    `UPDATE empresa
     SET nmfantasia = $1, cnpj = $2, isativo = $3
     WHERE idempresa = $4
     RETURNING idempresa AS id, idempresa, nmfantasia, cnpj, isativo`,
    [data.nmfantasia, data.cnpj, data.isativo, data.idempresa],
  );
  return rows[0] ?? null;
}

export async function remove(id: number): Promise<void> {
  await pool.query('DELETE FROM empresa WHERE idempresa = $1', [id]);
}
