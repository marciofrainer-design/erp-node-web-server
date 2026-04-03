import { pool } from '../../config/database';
import type { QueryResultRow } from 'pg';
import type { PaginatedResult, PaginationParams } from './pagination';

type QueryFilter = {
  clause: string;
  values: unknown[];
};

type RepositoryBaseConfig = {
  selectFields: string;
  selectFrom: string;
  selectOrderBy: string;
  tableName: string;
  tableIdColumn: string;
  selectIdExpression: string;
  createColumns: string[];
  updateColumns: string[];
};

type DataRecord = Record<string, unknown>;

export class RepositoryBase<
  TEntity extends QueryResultRow,
  TCreate extends DataRecord,
  TUpdate extends DataRecord,
> {
  private readonly config: RepositoryBaseConfig;

  constructor(config: RepositoryBaseConfig) {
    this.config = config;
  }

  async getAll(
    pagination: PaginationParams,
    filter?: QueryFilter,
  ): Promise<PaginatedResult<TEntity>> {
    const whereClause = filter ? ` WHERE ${filter.clause}` : '';
    const whereValues = filter?.values ?? [];

    const countResult = await pool.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total ${this.config.selectFrom}${whereClause}`,
      whereValues,
    );

    const total = Number(countResult.rows[0]?.total ?? 0);
    const computedPageCount = Math.max(1, Math.ceil(total / pagination.limit));
    const page = Math.min(Math.max(1, pagination.page), computedPageCount);
    const offset = (page - 1) * pagination.limit;

    const queryValues = [...whereValues, pagination.limit, offset];
    const limitParam = `$${queryValues.length - 1}`;
    const offsetParam = `$${queryValues.length}`;

    const { rows } = await pool.query<TEntity>(
      `SELECT ${this.config.selectFields} ${this.config.selectFrom}${whereClause} ORDER BY ${this.config.selectOrderBy} LIMIT ${limitParam} OFFSET ${offsetParam}`,
      queryValues,
    );

    return {
      data: rows,
      page,
      pageCount: computedPageCount,
      limit: pagination.limit,
      total,
    };
  }

  async getById(id: number): Promise<TEntity | null> {
    const { rows } = await pool.query<TEntity>(
      `SELECT ${this.config.selectFields} ${this.config.selectFrom} WHERE ${this.config.selectIdExpression} = $1`,
      [id],
    );

    return rows[0] ?? null;
  }

  async post(data: TCreate): Promise<TEntity> {
    const values = this.config.createColumns.map((column) => data[column]);
    const placeholders = this.config.createColumns.map((_, index) => `$${index + 1}`);

    const { rows } = await pool.query<{ id: number }>(
      `INSERT INTO ${this.config.tableName} (${this.config.createColumns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING ${this.config.tableIdColumn} AS id`,
      values,
    );

    const inserted = await this.getById(rows[0].id);

    if (!inserted) {
      throw new Error(`Failed to load inserted record from ${this.config.tableName}`);
    }

    return inserted;
  }

  async put(data: TUpdate): Promise<TEntity | null> {
    const idValue = data[this.config.tableIdColumn];
    const id = Number(idValue);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`Invalid ${this.config.tableIdColumn} for update`);
    }

    const values = this.config.updateColumns.map((column) => data[column]);
    const assignments = this.config.updateColumns.map(
      (column, index) => `${column} = $${index + 1}`,
    );

    const whereParam = `$${this.config.updateColumns.length + 1}`;
    const { rowCount } = await pool.query(
      `UPDATE ${this.config.tableName} SET ${assignments.join(', ')} WHERE ${this.config.tableIdColumn} = ${whereParam}`,
      [...values, id],
    );

    if (!rowCount) {
      return null;
    }

    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await pool.query(
      `DELETE FROM ${this.config.tableName} WHERE ${this.config.tableIdColumn} = $1`,
      [id],
    );
  }
}