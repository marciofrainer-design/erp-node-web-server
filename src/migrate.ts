import 'dotenv/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { pool } from './config/database';

const sql = readFileSync(resolve(process.cwd(), 'migrations/001_init.sql'), 'utf-8');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('[Migrate] Migration applied successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('[Migrate] Error:', err.message);
  process.exit(1);
});
