import 'dotenv/config';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { pool } from './config/database';

async function migrate() {
  const migrationsDir = resolve(process.cwd(), 'migrations');
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    for (const file of files) {
      const sql = readFileSync(resolve(migrationsDir, file), 'utf-8');
      console.log(`[Migrate] Running ${file}...`);
      await client.query(sql);
      console.log(`[Migrate] ${file} applied successfully.`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('[Migrate] Error:', err.message);
  process.exit(1);
});
