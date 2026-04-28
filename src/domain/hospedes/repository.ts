import { pool } from '../../config/database';
import type { Hospede, HospedeCreate, HospedeUpdate } from './schema';

const SELECT =
  'h.idhospede AS id, h.idhospede, h.idempresa, h.nome, h.documento, h.telefone, h.email, h.isativo';
const FROM = 'FROM hospede h';

export async function getAll(idempresa?: number): Promise<Hospede[]> {
  if (idempresa) {
    const { rows } = await pool.query<Hospede>(
      `SELECT ${SELECT} ${FROM} WHERE h.idempresa = $1 ORDER BY h.nome`,
      [idempresa],
    );
    return rows;
  }
  const { rows } = await pool.query<Hospede>(
    `SELECT ${SELECT} ${FROM} ORDER BY h.nome`,
  );
  return rows;
}

export async function getById(id: number): Promise<Hospede | null> {
  const { rows } = await pool.query<Hospede>(
    `SELECT ${SELECT} ${FROM} WHERE h.idhospede = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function post(data: HospedeCreate): Promise<Hospede> {
  const { rows } = await pool.query<Hospede>(
    `INSERT INTO hospede (idempresa, nome, documento, telefone, email)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING
       idhospede AS id, idhospede, idempresa, nome, documento, telefone, email, isativo`,
    [data.idempresa, data.nome, data.documento, data.telefone ?? null, data.email ?? null],
  );
  return rows[0];
}

export async function put(data: HospedeUpdate): Promise<Hospede | null> {
  const { rows } = await pool.query<Hospede>(
    `UPDATE hospede
     SET nome=$1, documento=$2, telefone=$3, email=$4, updated_at=now()
     WHERE idhospede=$5
     RETURNING
       idhospede AS id, idhospede, idempresa, nome, documento, telefone, email, isativo`,
    [data.nome, data.documento, data.telefone ?? null, data.email ?? null, data.idhospede],
  );
  return rows[0] ?? null;
}

export async function deleteById(id: number): Promise<void> {
  await pool.query('DELETE FROM hospede WHERE idhospede = $1', [id]);
}

export { deleteById as delete };
