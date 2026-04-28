import { pool } from '../../config/database';
import type { CheckInCheckOut, CheckInCreate, CheckInUpdate } from './schema';

const SELECT =
  'c.idcheckin AS id, c.idcheckin, c.idreserva, ' +
  'c.datacheckin, c.datacheckout, c.status';
const FROM = 'FROM checkin_checkout c';

export async function getAll(idreserva?: number): Promise<CheckInCheckOut[]> {
  if (idreserva) {
    const { rows } = await pool.query<CheckInCheckOut>(
      `SELECT ${SELECT} ${FROM} WHERE c.idreserva = $1 ORDER BY c.idcheckin`,
      [idreserva],
    );
    return rows;
  }
  const { rows } = await pool.query<CheckInCheckOut>(
    `SELECT ${SELECT} ${FROM} ORDER BY c.idcheckin`,
  );
  return rows;
}

export async function getById(id: number): Promise<CheckInCheckOut | null> {
  const { rows } = await pool.query<CheckInCheckOut>(
    `SELECT ${SELECT} ${FROM} WHERE c.idcheckin = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function post(data: CheckInCreate): Promise<CheckInCheckOut> {
  const { rows } = await pool.query<CheckInCheckOut>(
    `INSERT INTO checkin_checkout (idreserva, datacheckin, datacheckout, status)
     VALUES ($1, $2, $3, $4)
     RETURNING idcheckin AS id, idcheckin, idreserva, datacheckin, datacheckout, status`,
    [
      data.idreserva,
      data.datacheckin ?? null,
      data.datacheckout ?? null,
      data.status ?? 'PENDENTE',
    ],
  );
  return rows[0];
}

export async function put(data: CheckInUpdate): Promise<CheckInCheckOut | null> {
  const { rows } = await pool.query<CheckInCheckOut>(
    `UPDATE checkin_checkout
     SET datacheckin=$1, datacheckout=$2, status=$3, updated_at=now()
     WHERE idcheckin=$4
     RETURNING idcheckin AS id, idcheckin, idreserva, datacheckin, datacheckout, status`,
    [data.datacheckin ?? null, data.datacheckout ?? null, data.status, data.idcheckin],
  );
  return rows[0] ?? null;
}

export async function deleteById(id: number): Promise<void> {
  await pool.query('DELETE FROM checkin_checkout WHERE idcheckin = $1', [id]);
}

export { deleteById as delete };
