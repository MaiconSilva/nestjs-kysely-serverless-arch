/**
 * Dev migration runner — applies every *.sql file under
 * `packages/shared/src/infrastructure/database/migrations` in lexicographic order.
 *
 * Docker already mounts the migrations folder into `/docker-entrypoint-initdb.d`
 * so a fresh `docker-compose up` DB is seeded automatically; use this script
 * when re-running migrations against an existing database or against the test DB.
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

async function main(): Promise<void> {
  const dir = join(__dirname, '..', 'packages/shared/src/infrastructure/database/migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  const client = new Client({
    host: process.env.PG_HOST ?? 'localhost',
    port: Number(process.env.PG_PORT ?? 5432),
    database: process.env.PG_DATABASE ?? 'todo_dev',
    user: process.env.PG_USER ?? 'todo',
    password: process.env.PG_PASSWORD ?? 'todo123',
  });

  await client.connect();
  try {
    for (const file of files) {
      const sql = readFileSync(join(dir, file), 'utf8');
      // Wrapping each file in a transaction keeps failures atomic.
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`[migrate] applied ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('[migrate] failed', err);
  process.exit(1);
});
