import type { Andar } from './types';
import type { PaginatedResult, PaginationParams } from '../shared/pagination';
import { RepositoryBase } from '../shared/repositoryBase';
import { AndarSchema } from './schema';

type AndarCreate = Pick<Andar, 'idempresa' | 'cdandar' | 'nmandar' | 'isativo'>;
type AndarUpdate = Pick<Andar, 'idandar' | 'idempresa' | 'cdandar' | 'nmandar' | 'isativo'>;

class AndarRepository extends RepositoryBase<Andar, AndarCreate, AndarUpdate> {
  constructor() {
    super({
      selectFields:
        'a.idandar AS id, a.idandar, a.idempresa, e.nmfantasia AS nmempresa, a.cdandar, a.nmandar, a.isativo',
      selectFrom: 'FROM andar a JOIN empresa e ON e.idempresa = a.idempresa',
      selectOrderBy: 'a.nmandar',
      tableName: 'andar',
      tableIdColumn: 'idandar',
      selectIdExpression: 'a.idandar',
      createColumns: ['idempresa', 'cdandar', 'nmandar', 'isativo'],
      updateColumns: ['idempresa', 'cdandar', 'nmandar', 'isativo'],
    });
  }

  getAllByEmpresa(
    empresaId: number | undefined,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Andar>> {
    if (empresaId) {
      return super.getAll(pagination, {
        clause: 'a.idempresa = $1',
        values: [empresaId],
      });
    }

    return super.getAll(pagination);
  }
}

const repository = new AndarRepository();

export async function getAll(
  empresaId: number | undefined,
  pagination: PaginationParams,
): Promise<PaginatedResult<Andar>> {
  return repository.getAllByEmpresa(empresaId, pagination);
}

export async function getById(id: number): Promise<Andar | null> {
  return repository.getById(id);
}

export async function post(data: AndarCreate): Promise<Andar> {
  return repository.post(data);
}

export async function put(data: AndarUpdate): Promise<Andar | null> {
  return repository.put(data);
}

export async function deleteById(id: number): Promise<void> {
  await repository.delete(id);
}

export { deleteById as delete };
