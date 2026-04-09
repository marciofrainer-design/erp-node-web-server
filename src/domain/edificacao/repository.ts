import type { Edificacao } from './types';
import type { PaginatedResult, PaginationParams } from '../shared/pagination';
import { RepositoryBase } from '../shared/repositoryBase';

type EdificacaoCreate = Pick<Edificacao, 'idempresa' | 'cdedificacao' | 'nmedificacao' | 'isativo'>;
type EdificacaoUpdate = Pick<Edificacao, 'idedificacao' | 'idempresa' | 'cdedificacao' | 'nmedificacao' | 'isativo'>;

class EdificacaoRepository extends RepositoryBase<Edificacao, EdificacaoCreate, EdificacaoUpdate> {
  constructor() {
    super({
      selectFields:
        'ed.idedificacao AS id, ed.idedificacao, ed.idempresa, e.dsabreviatura AS empresa_dsabreviatura, ed.cdedificacao, ed.nmedificacao, ed.isativo',
      selectFrom: 'FROM edificacao ed JOIN empresa e ON e.idempresa = ed.idempresa',
      selectOrderBy: 'ed.nmedificacao',
      tableName: 'edificacao',
      tableIdColumn: 'idedificacao',
      selectIdExpression: 'ed.idedificacao',
      createColumns: ['idempresa', 'cdedificacao', 'nmedificacao', 'isativo'],
      updateColumns: ['idempresa', 'cdedificacao', 'nmedificacao', 'isativo'],
    });
  }

  getAllByEmpresa(
    empresaId: number | undefined,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Edificacao>> {
    if (empresaId) {
      return super.getAll(pagination, {
        clause: 'ed.idempresa = $1',
        values: [empresaId],
      });
    }

    return super.getAll(pagination);
  }
}

const repository = new EdificacaoRepository();

export async function getAll(
  empresaId: number | undefined,
  pagination: PaginationParams,
): Promise<PaginatedResult<Edificacao>> {
  return repository.getAllByEmpresa(empresaId, pagination);
}

export async function getById(id: number): Promise<Edificacao | null> {
  return repository.getById(id);
}

export async function post(data: EdificacaoCreate): Promise<Edificacao> {
  return repository.post(data);
}

export async function put(data: EdificacaoUpdate): Promise<Edificacao | null> {
  return repository.put(data);
}

export async function deleteById(id: number): Promise<void> {
  await repository.delete(id);
}

export { deleteById as delete };
