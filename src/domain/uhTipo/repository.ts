import type { UhTipo } from './types';
import type { PaginatedResult, PaginationParams } from '../shared/pagination';
import { RepositoryBase } from '../shared/repositoryBase';

type UhTipoCreate = Pick<
  UhTipo,
  'idempresa' | 'cduhtipo' | 'nmuhtipo' | 'dsuhtipo' | 'iduhtipogrupo' | 'idpai' | 'qtleito' | 'fltipocobranca' | 'flsituacao'
>;
type UhTipoUpdate = Pick<
  UhTipo,
  'iduhtipo' | 'idempresa' | 'cduhtipo' | 'nmuhtipo' | 'dsuhtipo' | 'iduhtipogrupo' | 'idpai' | 'qtleito' | 'fltipocobranca' | 'flsituacao'
>;

class UhTipoRepository extends RepositoryBase<UhTipo, UhTipoCreate, UhTipoUpdate> {
  constructor() {
    super({
      selectFields: [
        'ut.iduhtipo AS id',
        'ut.iduhtipo',
        'ut.idempresa',
        'e.dsabreviatura AS empresa_dsabreviatura',
        'ut.cduhtipo',
        'ut.nmuhtipo',
        'ut.dsuhtipo',
        'ut.iduhtipogrupo',
        'g.nmtipogrupo',
        'ut.idpai',
        'ut.qtleito',
        'ut.fltipocobranca',
        'ut.flsituacao',
      ].join(', '),
      selectFrom:
        'FROM uhtipo ut ' +
        'JOIN empresa e ON e.idempresa = ut.idempresa ' +
        'LEFT JOIN uhtipo_grupo g ON g.iduhtipogrupo = ut.iduhtipogrupo',
      selectOrderBy: 'ut.nmuhtipo',
      tableName: 'uhtipo',
      tableIdColumn: 'iduhtipo',
      selectIdExpression: 'ut.iduhtipo',
      createColumns: ['idempresa', 'cduhtipo', 'nmuhtipo', 'dsuhtipo', 'iduhtipogrupo', 'idpai', 'qtleito', 'fltipocobranca', 'flsituacao'],
      updateColumns: ['idempresa', 'cduhtipo', 'nmuhtipo', 'dsuhtipo', 'iduhtipogrupo', 'idpai', 'qtleito', 'fltipocobranca', 'flsituacao'],
    });
  }

  getAllByEmpresa(
    empresaId: number | undefined,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<UhTipo>> {
    if (empresaId) {
      return super.getAll(pagination, {
        clause: 'ut.idempresa = $1',
        values: [empresaId],
      });
    }

    return super.getAll(pagination);
  }
}

const repository = new UhTipoRepository();

export async function getAll(
  empresaId: number | undefined,
  pagination: PaginationParams,
): Promise<PaginatedResult<UhTipo>> {
  return repository.getAllByEmpresa(empresaId, pagination);
}

export async function getById(id: number): Promise<UhTipo | null> {
  return repository.getById(id);
}

export async function post(data: UhTipoCreate): Promise<UhTipo> {
  return repository.post(data);
}

export async function put(data: UhTipoUpdate): Promise<UhTipo | null> {
  return repository.put(data);
}

export async function deleteById(id: number): Promise<void> {
  await repository.delete(id);
}

export { deleteById as delete };
