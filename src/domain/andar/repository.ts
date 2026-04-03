import { pool } from '../../config/database';
import type { Andar } from './types';

const SELECT = `
  SELECT
    a.idandar AS id,
    a.idandar,
    a.idempresa,
    e.nmfantasia AS nmempresa,
    a.cdandar,
    a.nmandar,
    a.isativo
  FROM andar a
  JOIN empresa e ON e.idempresa = a.idempresa
`;

export async function getAll(empresaId?: number): Promise<Andar[]> {
  if (empresaId) {
    const { rows } = await pool.query(
      `${SELECT} WHERE a.idempresa = $1 ORDER BY a.nmandar`,
      [empresaId],
    );
    return rows;
  }
  const { rows } = await pool.query(`${SELECT} ORDER BY a.nmandar`);
  return rows;
}

export async function getById(id: number): Promise<Andar | null> {
  const { rows } = await pool.query(`${SELECT} WHERE a.idandar = $1`, [id]);
  return rows[0] ?? null;
}

export async function save(
  data: Pick<Andar, 'idempresa' | 'cdandar' | 'nmandar' | 'isativo'>,
): Promise<Andar> {
  const { rows } = await pool.query(
    `INSERT INTO andar (idempresa, cdandar, nmandar, isativo)
     VALUES ($1, $2, $3, $4)
     RETURNING idandar`,
    [data.idempresa, data.cdandar, data.nmandar, data.isativo],
  );
  const inserted = await getById(rows[0].idandar);
  return inserted!;
}

export async function update(data: Andar): Promise<Andar | null> {
  const { rowCount } = await pool.query(
    `UPDATE andar
     SET idempresa = $1, cdandar = $2, nmandar = $3, isativo = $4
     WHERE idandar = $5`,
    [data.idempresa, data.cdandar, data.nmandar, data.isativo, data.idandar],
  );
  if (!rowCount) return null;
  return getById(data.idandar);
}

export async function remove(id: number): Promise<void> {
  await pool.query('DELETE FROM andar WHERE idandar = $1', [id]);
}
