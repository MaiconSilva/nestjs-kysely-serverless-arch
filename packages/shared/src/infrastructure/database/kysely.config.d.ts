import { Kysely, type Transaction } from 'kysely';
import { Pool } from 'pg';
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
export declare function createKysely(cfg?: KyselyDatabaseConfig): Kysely<DB>;
export declare function getPool(): Pool;
export declare function closeKysely(): Promise<void>;
/**
 * Run a block inside a transaction with `app.current_tenant` bound to the given
 * tenant id. RLS policies then filter rows automatically.
 *
 * `SET LOCAL` is scoped to the current transaction, which makes it safe for
 * pooled connections (the setting disappears on COMMIT/ROLLBACK).
 */
export declare function withTenant<T>(db: Kysely<DB>, tenantId: string, work: (trx: Transaction<DB>) => Promise<T>): Promise<T>;
//# sourceMappingURL=kysely.config.d.ts.map