import { Kysely, PostgresDialect, sql, type Transaction } from 'kysely';
import { Pool, type PoolConfig } from 'pg';
import type { DB } from './schema.types';

export interface KyselyDatabaseConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  max?: number;
}

/**
 * Lazy singleton pool — Lambdas reuse the same PG pool across warm invocations.
 * Keep `max` low; effective Postgres connections = Lambda concurrency * pool max.
 */
let poolInstance: Pool | null = null;
let dbInstance: Kysely<DB> | null = null;

export function createKysely(cfg: KyselyDatabaseConfig = {}): Kysely<DB> {
  if (dbInstance) return dbInstance;

  const poolConfig: PoolConfig = cfg.connectionString
    ? { connectionString: cfg.connectionString, max: cfg.max ?? 2 }
    : {
        host: cfg.host ?? process.env.PG_HOST ?? 'localhost',
        port: cfg.port ?? Number(process.env.PG_PORT ?? 5432),
        database: cfg.database ?? process.env.PG_DATABASE ?? 'todo_dev',
        user: cfg.user ?? process.env.PG_USER ?? 'todo',
        password: cfg.password ?? process.env.PG_PASSWORD ?? 'todo123',
        max: cfg.max ?? Number(process.env.PG_MAX_CONNECTIONS ?? 2),
      };

  poolInstance = new Pool(poolConfig);
  dbInstance = new Kysely<DB>({
    dialect: new PostgresDialect({ pool: poolInstance }),
  });
  return dbInstance;
}

export function getPool(): Pool {
  if (!poolInstance) createKysely();
  return poolInstance as Pool;
}

export async function closeKysely(): Promise<void> {
  if (dbInstance) {
    await dbInstance.destroy();
    dbInstance = null;
    poolInstance = null;
  }
}

/**
 * Run a block inside a transaction with `app.current_tenant` bound to the given
 * tenant id. RLS policies then filter rows automatically.
 *
 * `SET LOCAL` is scoped to the current transaction, which makes it safe for
 * pooled connections (the setting disappears on COMMIT/ROLLBACK).
 */
export async function withTenant<T>(
  db: Kysely<DB>,
  tenantId: string,
  work: (trx: Transaction<DB>) => Promise<T>,
): Promise<T> {
  return db.transaction().execute(async (trx) => {
    await sql`SELECT set_config('app.current_tenant', ${tenantId}, true)`.execute(trx);
    return work(trx);
  });
}
