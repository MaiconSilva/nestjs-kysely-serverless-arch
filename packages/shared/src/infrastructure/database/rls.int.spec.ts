/**
 * Integration test — proves RLS isolates tenants. Requires
 * `docker-compose -f docker-compose.test.yml up -d` beforehand.
 */
import { randomUUID } from 'crypto';
import { sql } from 'kysely';
import { closeKysely, createKysely, withTenant } from './kysely.config';

const TEST_DB = {
  host: 'localhost',
  port: 5433,
  database: 'todo_test',
  user: 'todo',
  password: 'todo123',
};

describe('RLS tenant isolation', () => {
  const db = createKysely(TEST_DB);

  afterAll(async () => {
    await closeKysely();
  });

  it('hides rows from a different tenant', async () => {
    const tenantA = randomUUID();
    const tenantB = randomUUID();

    await db
      .insertInto('tenants')
      .values([
        { id: tenantA, name: 'A', slug: `a-${tenantA.slice(0, 8)}` },
        { id: tenantB, name: 'B', slug: `b-${tenantB.slice(0, 8)}` },
      ])
      .execute();

    const uA = randomUUID();
    const uB = randomUUID();

    // Inserts must themselves run inside a tenant context because users RLS
    // also enforces WITH CHECK on INSERT.
    await withTenant(db, tenantA, async (trx) => {
      await trx
        .insertInto('users')
        .values({ id: uA, tenant_id: tenantA, name: 'Alice', email: 'a@a.com', role: 'admin' })
        .execute();
    });
    await withTenant(db, tenantB, async (trx) => {
      await trx
        .insertInto('users')
        .values({ id: uB, tenant_id: tenantB, name: 'Bob', email: 'b@b.com', role: 'admin' })
        .execute();
    });

    const seenByA = await withTenant(db, tenantA, (trx) =>
      trx.selectFrom('users').selectAll().execute(),
    );
    expect(seenByA).toHaveLength(1);
    expect(seenByA[0].email).toBe('a@a.com');

    const seenByB = await withTenant(db, tenantB, (trx) =>
      trx.selectFrom('users').selectAll().execute(),
    );
    expect(seenByB).toHaveLength(1);
    expect(seenByB[0].email).toBe('b@b.com');

    await withTenant(db, tenantA, (trx) =>
      trx.deleteFrom('users').where('id', '=', uA).execute(),
    );
    await withTenant(db, tenantB, (trx) =>
      trx.deleteFrom('users').where('id', '=', uB).execute(),
    );
    await sql`DELETE FROM tenants WHERE id IN (${tenantA}, ${tenantB})`.execute(db);
  });
});
