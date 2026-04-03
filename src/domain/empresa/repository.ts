import type { Empresa } from './types';
import type { PaginatedResult, PaginationParams } from '../shared/pagination';
import { RepositoryBase } from '../shared/repositoryBase';

type EmpresaCreate = Pick<Empresa, 'nmfantasia' | 'cnpj' | 'isativo'>;
type EmpresaUpdate = Pick<Empresa, 'idempresa' | 'nmfantasia' | 'cnpj' | 'isativo'>;

class EmpresaRepository extends RepositoryBase<Empresa, EmpresaCreate, EmpresaUpdate> {
  constructor() {
    super({
      selectFields: 'idempresa AS id, idempresa, nmfantasia, cnpj, isativo',
      selectFrom: 'FROM empresa',
      selectOrderBy: 'nmfantasia',
      tableName: 'empresa',
      tableIdColumn: 'idempresa',
      selectIdExpression: 'idempresa',
      createColumns: ['nmfantasia', 'cnpj', 'isativo'],
      updateColumns: ['nmfantasia', 'cnpj', 'isativo'],
    });
  }
}

const repository = new EmpresaRepository();

export async function getAll(
  pagination: PaginationParams,
): Promise<PaginatedResult<Empresa>> {
  return repository.getAll(pagination);
}

export async function getById(id: number): Promise<Empresa | null> {
  return repository.getById(id);
}

export async function post(data: EmpresaCreate): Promise<Empresa> {
  return repository.post(data);
}

export async function put(data: EmpresaUpdate): Promise<Empresa | null> {
  return repository.put(data);
}

export async function deleteById(id: number): Promise<void> {
  await repository.delete(id);
}

export { deleteById as delete };
