import type { Caracteristica } from './types';
import type { PaginatedResult, PaginationParams } from '../shared/pagination';
import { RepositoryBase } from '../shared/repositoryBase';

type CaracteristicaCreate = Pick<
  Caracteristica,
  | 'idempresa'
  | 'dscaracteristica'
  | 'dsabreviatura'
  | 'fltipo'
  | 'idcaracteristica_emp'
  | 'flsituacao'
>;

type CaracteristicaUpdate = Pick<
  Caracteristica,
  | 'idcaracteristica'
  | 'idempresa'
  | 'dscaracteristica'
  | 'dsabreviatura'
  | 'fltipo'
  | 'idcaracteristica_emp'
  | 'flsituacao'
>;

class CaracteristicaRepository extends RepositoryBase<Caracteristica, CaracteristicaCreate, CaracteristicaUpdate> {
  constructor() {
    super({
      selectFields: [
        'c.idcaracteristica AS id',
        'c.idcaracteristica',
        'c.idempresa',
        "COALESCE(e.dsabreviatura, '') AS empresa_dsabreviatura",
        'c.dscaracteristica',
        'c.dsabreviatura',
        'c.fltipo',
        'c.idcaracteristica_emp',
        'c.flsituacao',
      ].join(', '),
      selectFrom:
        'FROM caracteristica c ' +
        'JOIN empresa e ON e.idempresa = c.idempresa',
      selectOrderBy: 'c.dscaracteristica',
      tableName: 'caracteristica',
      tableIdColumn: 'idcaracteristica',
      selectIdExpression: 'c.idcaracteristica',
      createColumns: ['idempresa', 'dscaracteristica', 'dsabreviatura', 'fltipo', 'idcaracteristica_emp', 'flsituacao'],
      updateColumns: ['idempresa', 'dscaracteristica', 'dsabreviatura', 'fltipo', 'idcaracteristica_emp', 'flsituacao'],
    });
  }

  getAllByEmpresa(
    empresaId: number | undefined,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Caracteristica>> {
    if (empresaId) {
      return super.getAll(pagination, {
        clause: 'c.idempresa = $1',
        values: [empresaId],
      });
    }

    return super.getAll(pagination);
  }
}

const repository = new CaracteristicaRepository();

export async function getAll(
  empresaId: number | undefined,
  pagination: PaginationParams,
): Promise<PaginatedResult<Caracteristica>> {
  return repository.getAllByEmpresa(empresaId, pagination);
}

export async function getById(id: number): Promise<Caracteristica | null> {
  return repository.getById(id);
}

export async function post(data: CaracteristicaCreate): Promise<Caracteristica> {
  return repository.post(data);
}

export async function put(data: CaracteristicaUpdate): Promise<Caracteristica | null> {
  return repository.put(data);
}

export async function deleteById(id: number): Promise<void> {
  await repository.delete(id);
}

export { deleteById as delete };
