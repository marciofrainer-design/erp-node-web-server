import type { UhClassificacao } from './types';
import type { PaginatedResult, PaginationParams } from '../shared/pagination';
import { RepositoryBase } from '../shared/repositoryBase';

type UhClassificacaoCreate = Pick<UhClassificacao, 'idempresa' | 'dsidentificador' | 'nmclassificacao' | 'isativo'>;
type UhClassificacaoUpdate = Pick<UhClassificacao, 'iduhclassificacao' | 'idempresa' | 'dsidentificador' | 'nmclassificacao' | 'isativo'>;

class UhClassificacaoRepository extends RepositoryBase<UhClassificacao, UhClassificacaoCreate, UhClassificacaoUpdate> {
  constructor() {
    super({
      selectFields:
        'uc.iduhclassificacao AS id, uc.iduhclassificacao, uc.idempresa, uc.dsidentificador, uc.nmclassificacao, uc.isativo',
      selectFrom: 'FROM uhclassificacao uc',
      selectOrderBy: 'uc.nmclassificacao',
      tableName: 'uhclassificacao',
      tableIdColumn: 'iduhclassificacao',
      selectIdExpression: 'uc.iduhclassificacao',
      createColumns: ['idempresa', 'dsidentificador', 'nmclassificacao', 'isativo'],
      updateColumns: ['idempresa', 'dsidentificador', 'nmclassificacao', 'isativo'],
    });
  }

  getAllByEmpresa(
    empresaId: number | undefined,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<UhClassificacao>> {
    if (empresaId) {
      return super.getAll(pagination, {
        clause: 'uc.idempresa = $1',
        values: [empresaId],
      });
    }

    return super.getAll(pagination);
  }
}

const repository = new UhClassificacaoRepository();

export async function getAll(
  empresaId: number | undefined,
  pagination: PaginationParams,
): Promise<PaginatedResult<UhClassificacao>> {
  return repository.getAllByEmpresa(empresaId, pagination);
}

export async function getById(id: number): Promise<UhClassificacao | null> {
  return repository.getById(id);
}

export async function post(data: UhClassificacaoCreate): Promise<UhClassificacao> {
  return repository.post(data);
}

export async function put(data: UhClassificacaoUpdate): Promise<UhClassificacao | null> {
  return repository.put(data);
}

export async function deleteById(id: number): Promise<void> {
  await repository.delete(id);
}

export { deleteById as delete };
