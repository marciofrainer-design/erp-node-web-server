import { pool } from './database';
import { Pool } from 'pg';

export class databaseFactory {
    private static pool: Pool;

    static getPool(): Pool {
        if (!this.pool) {
            this.pool = pool;
        }
        return this.pool;
    }
}