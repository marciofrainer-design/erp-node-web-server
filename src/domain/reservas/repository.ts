import { pool } from '../../config/database';
import type { Reserva, ReservaCreate, ReservaUpdate } from './schema';

const SELECT =
  'r.idreserva AS id, r.idreserva, r.idempresa, r.idhospede, r.iduh, ' +
  "TO_CHAR(r.dataentrada, 'YYYY-MM-DD') AS dataentrada, " +
  "TO_CHAR(r.datasaida, 'YYYY-MM-DD') AS datasaida, r.status, r.isativo";
const FROM = 'FROM reserva r';

export async function getAll(idempresa?: number): Promise<Reserva[]> {
  if (idempresa) {
    const { rows } = await pool.query<Reserva>(
      `SELECT ${SELECT} ${FROM} WHERE r.idempresa = $1 ORDER BY r.dataentrada DESC`,
      [idempresa],
    );
    return rows;
  }
  const { rows } = await pool.query<Reserva>(
    `SELECT ${SELECT} ${FROM} ORDER BY r.dataentrada DESC`,
  );
  return rows;
}

export async function getById(id: number): Promise<Reserva | null> {
  const { rows } = await pool.query<Reserva>(
    `SELECT ${SELECT} ${FROM} WHERE r.idreserva = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function post(data: ReservaCreate): Promise<Reserva> {
  const { rows } = await pool.query<Reserva>(
    `INSERT INTO reserva (idempresa, idhospede, iduh, dataentrada, datasaida, status)
     VALUES ($1, $2, $3, $4::DATE, $5::DATE, $6)
     RETURNING
       idreserva AS id, idreserva, idempresa, idhospede, iduh,
       TO_CHAR(dataentrada, 'YYYY-MM-DD') AS dataentrada,
       TO_CHAR(datasaida, 'YYYY-MM-DD')   AS datasaida,
       status, isativo`,
    [data.idempresa, data.idhospede, data.iduh, data.dataentrada, data.datasaida, data.status ?? 'PENDENTE'],
  );
  return rows[0];
}

export async function put(data: ReservaUpdate): Promise<Reserva | null> {
  const { rows } = await pool.query<Reserva>(
    `UPDATE reserva SET status=$1, updated_at=now() WHERE idreserva=$2
     RETURNING
       idreserva AS id, idreserva, idempresa, idhospede, iduh,
       TO_CHAR(dataentrada, 'YYYY-MM-DD') AS dataentrada,
       TO_CHAR(datasaida, 'YYYY-MM-DD')   AS datasaida,
       status, isativo`,
    [data.status, data.idreserva],
  );
  return rows[0] ?? null;
}

export async function deleteById(id: number): Promise<void> {
  await pool.query('DELETE FROM reserva WHERE idreserva = $1', [id]);
}

export { deleteById as delete };
