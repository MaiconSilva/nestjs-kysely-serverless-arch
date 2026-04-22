"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKysely = createKysely;
exports.getPool = getPool;
exports.closeKysely = closeKysely;
exports.withTenant = withTenant;
const kysely_1 = require("kysely");
const pg_1 = require("pg");
/**
 * Lazy singleton pool — Lambdas reuse the same PG pool across warm invocations.
 * Keep `max` low; effective Postgres connections = Lambda concurrency * pool max.
 */
let poolInstance = null;
let dbInstance = null;
function createKysely(cfg = {}) {
    if (dbInstance)
        return dbInstance;
    const poolConfig = cfg.connectionString
        ? { connectionString: cfg.connectionString, max: cfg.max ?? 2 }
        : {
            host: cfg.host ?? process.env.PG_HOST ?? 'localhost',
            port: cfg.port ?? Number(process.env.PG_PORT ?? 5432),
            database: cfg.database ?? process.env.PG_DATABASE ?? 'todo_dev',
            user: cfg.user ?? process.env.PG_USER ?? 'todo',
            password: cfg.password ?? process.env.PG_PASSWORD ?? 'todo123',
            max: cfg.max ?? Number(process.env.PG_MAX_CONNECTIONS ?? 2),
        };
    poolInstance = new pg_1.Pool(poolConfig);
    dbInstance = new kysely_1.Kysely({
        dialect: new kysely_1.PostgresDialect({ pool: poolInstance }),
    });
    return dbInstance;
}
function getPool() {
    if (!poolInstance)
        createKysely();
    return poolInstance;
}
async function closeKysely() {
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
async function withTenant(db, tenantId, work) {
    return db.transaction().execute(async (trx) => {
        await (0, kysely_1.sql) `SELECT set_config('app.current_tenant', ${tenantId}, true)`.execute(trx);
        return work(trx);
    });
}
//# sourceMappingURL=kysely.config.js.map