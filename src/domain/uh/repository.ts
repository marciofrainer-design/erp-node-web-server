import type { Uh, UhCaracteristica } from './types';
import type { PaginatedResult, PaginationParams } from '../shared/pagination';
import { RepositoryBase } from '../shared/repositoryBase';
import { pool } from '../../config/database';

type UhCaracteristicaInput = {
  idcaracteristica: number;
  isprincipal: number;
};

type UhCreate = Pick<
  Uh,
  | 'idempresa'
  | 'cduh'
  | 'dsuh'
  | 'iduhtipo'
  | 'nmandar'
  | 'nmedificacao'
  | 'qtquarto'
  | 'iduhclassificacao'
  | 'isativo'
  | 'isacessibilidade'
> & { caracteristicas?: UhCaracteristicaInput[] };

type UhUpdate = Pick<
  Uh,
  | 'iduh'
  | 'idempresa'
  | 'cduh'
  | 'dsuh'
  | 'iduhtipo'
  | 'nmandar'
  | 'nmedificacao'
  | 'qtquarto'
  | 'iduhclassificacao'
  | 'isativo'
  | 'isacessibilidade'
> & { caracteristicas?: UhCaracteristicaInput[] };

class UhRepository extends RepositoryBase<Uh, UhCreate, UhUpdate> {
  constructor() {
    super({
      selectFields: [
        'u.iduh AS id',
        'u.iduh',
        'u.idempresa',
        "COALESCE(e.dsabreviatura, '') AS empresa_dsabreviatura",
        'u.cduh',
        'u.dsuh',
        'u.iduhtipo',
        'ut.nmuhtipo',
        'u.nmandar',
        'u.nmedificacao',
        'u.qtquarto',
        'u.iduhclassificacao',
        'u.isativo',
        'u.isacessibilidade',
      ].join(', '),
      selectFrom:
        'FROM uh u ' +
        'JOIN empresa e ON e.idempresa = u.idempresa ' +
        'LEFT JOIN uhtipo ut ON ut.iduhtipo = u.iduhtipo',
      selectOrderBy: 'u.cduh',
      tableName: 'uh',
      tableIdColumn: 'iduh',
      selectIdExpression: 'u.iduh',
      createColumns: [
        'idempresa',
        'cduh',
        'dsuh',
        'iduhtipo',
        'nmandar',
        'nmedificacao',
        'qtquarto',
        'iduhclassificacao',
        'isativo',
        'isacessibilidade',
      ],
      updateColumns: [
        'idempresa',
        'cduh',
        'dsuh',
        'iduhtipo',
        'nmandar',
        'nmedificacao',
        'qtquarto',
        'iduhclassificacao',
        'isativo',
        'isacessibilidade',
      ],
    });
  }

  private async getCaracteristicasByUhIds(
    ids: number[],
  ): Promise<Map<number, UhCaracteristica[]>> {
    if (ids.length === 0) return new Map();

    const { rows } = await pool.query<{ iduh: number } & UhCaracteristica>(
      `SELECT
         uc.iduh,
         c.idcaracteristica,
         c.dscaracteristica,
         c.dsabreviatura,
         c.fltipo,
         c.flsituacao,
         uc.isprincipal,
         COALESCE(e.dsabreviatura, '') AS empresa_dsabreviatura
       FROM uhcaracteristica uc
       JOIN caracteristica c ON c.idcaracteristica = uc.idcaracteristica
       JOIN empresa e        ON e.idempresa = c.idempresa
       WHERE uc.iduh = ANY($1::int[])
       ORDER BY uc.isprincipal DESC, c.dscaracteristica`,
      [ids],
    );

    const map = new Map<number, UhCaracteristica[]>();
    for (const { iduh, ...car } of rows) {
      if (!map.has(iduh)) map.set(iduh, []);
      map.get(iduh)!.push(car);
    }
    return map;
  }

  private async syncCaracteristicas(
    iduh: number,
    items: UhCaracteristicaInput[],
  ): Promise<void> {
    await pool.query('DELETE FROM uhcaracteristica WHERE iduh = $1', [iduh]);
    if (items.length === 0) return;

    const values: unknown[] = [];
    const placeholders = items.map((item, i) => {
      const base = i * 3;
      values.push(iduh, item.idcaracteristica, item.isprincipal);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    });

    await pool.query(
      `INSERT INTO uhcaracteristica (iduh, idcaracteristica, isprincipal)
       VALUES ${placeholders.join(', ')}
       ON CONFLICT (iduh, idcaracteristica) DO UPDATE SET isprincipal = EXCLUDED.isprincipal`,
      values,
    );
  }

  override async post(data: UhCreate): Promise<Uh> {
    const uh = await super.post(data);
    await this.syncCaracteristicas(uh.iduh, data.caracteristicas ?? []);
    return (await this.getById(uh.iduh))!;
  }

  override async put(data: UhUpdate): Promise<Uh | null> {
    const uh = await super.put(data);
    if (!uh) return null;
    await this.syncCaracteristicas(uh.iduh, data.caracteristicas ?? []);
    return this.getById(uh.iduh);
  }

  async getAllByEmpresa(
    empresaId: number | undefined,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Uh>> {
    const result = empresaId
      ? await super.getAll(pagination, { clause: 'u.idempresa = $1', values: [empresaId] })
      : await super.getAll(pagination);

    const ids = result.data.map((u) => u.iduh);
    const carMap = await this.getCaracteristicasByUhIds(ids);
    result.data = result.data.map((u) => ({
      ...u,
      caracteristicas: carMap.get(u.iduh) ?? [],
    }));

    return result;
  }

  async getById(id: number): Promise<Uh | null> {
    const uh = await super.getById(id);
    if (!uh) return null;

    const carMap = await this.getCaracteristicasByUhIds([uh.iduh]);
    return { ...uh, caracteristicas: carMap.get(uh.iduh) ?? [] };
  }
}

const repository = new UhRepository();

export async function getAll(
  empresaId: number | undefined,
  pagination: PaginationParams,
): Promise<PaginatedResult<Uh>> {
  return repository.getAllByEmpresa(empresaId, pagination);
}

export async function getById(id: number): Promise<Uh | null> {
  return repository.getById(id);
}

export async function post(data: UhCreate): Promise<Uh> {
  return repository.post(data);
}

export async function put(data: UhUpdate): Promise<Uh | null> {
  return repository.put(data);
}

export async function deleteById(id: number): Promise<void> {
  await repository.delete(id);
}

export { deleteById as delete };
