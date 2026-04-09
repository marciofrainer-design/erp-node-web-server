import type { Uh } from './types';
import type { PaginatedResult, PaginationParams } from '../shared/pagination';
import { RepositoryBase } from '../shared/repositoryBase';

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
>;

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
>;

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

  getAllByEmpresa(
    empresaId: number | undefined,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Uh>> {
    if (empresaId) {
      return super.getAll(pagination, {
        clause: 'u.idempresa = $1',
        values: [empresaId],
      });
    }

    return super.getAll(pagination);
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
