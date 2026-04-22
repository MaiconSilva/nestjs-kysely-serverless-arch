/**
 * Integration test — drives the Activities module through HTTP using Fastify's
 * inject() so we exercise: guards → controller → use case → Kysely → Postgres.
 *
 * Requires:
 *   docker-compose -f docker-compose.test.yml up -d
 *
 * Uses the local HS256 JWT verifier (AUTH_MODE=local) to avoid needing
 * a real AWS Cognito pool in CI.
 */
import { randomUUID } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import {
  DomainErrorFilter,
  LocalHsJwtVerifier,
  closeKysely,
  createKysely,
  resetJwtVerifier,
  withTenant,
} from '@todolist/shared';
import { sql } from 'kysely';
import { ActivitiesModule } from './activities.module';

const SECRET = 'test-secret';

process.env.PG_HOST = 'localhost';
process.env.PG_PORT = '5433';
process.env.PG_DATABASE = 'todo_test';
process.env.PG_USER = 'todo';
process.env.PG_PASSWORD = 'todo123';
process.env.AUTH_MODE = 'local';
process.env.JWT_LOCAL_SECRET = SECRET;

describe('Activities HTTP integration', () => {
  let app: NestFastifyApplication;
  const signer = new LocalHsJwtVerifier(SECRET);

  const tenantA = randomUUID();
  const tenantB = randomUUID();
  const adminAId = randomUUID();
  const adminASub = randomUUID();
  const memberAId = randomUUID();
  const memberASub = randomUUID();
  const memberBId = randomUUID();
  const memberBSub = randomUUID();

  function token(
    sub: string,
    tenantId: string,
    role: 'admin' | 'member',
  ): string {
    return signer.sign({ sub, tenantId, role });
  }

  beforeAll(async () => {
    resetJwtVerifier();
    app = await NestFactory.create<NestFastifyApplication>(
      ActivitiesModule,
      new FastifyAdapter({ logger: false }),
      { logger: false },
    );
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new DomainErrorFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Seed two tenants and their users.
    const db = createKysely();
    await db
      .insertInto('tenants')
      .values([
        { id: tenantA, name: 'A', slug: `a-${tenantA.slice(0, 8)}` },
        { id: tenantB, name: 'B', slug: `b-${tenantB.slice(0, 8)}` },
      ])
      .execute();

    await withTenant(db, tenantA, (trx) =>
      trx
        .insertInto('users')
        .values([
          {
            id: adminAId,
            tenant_id: tenantA,
            name: 'Admin A',
            email: `admin-${adminAId.slice(0, 6)}@a.com`,
            role: 'admin',
            cognito_sub: adminASub,
          },
          {
            id: memberAId,
            tenant_id: tenantA,
            name: 'Member A',
            email: `m-${memberAId.slice(0, 6)}@a.com`,
            role: 'member',
            cognito_sub: memberASub,
          },
        ])
        .execute(),
    );
    await withTenant(db, tenantB, (trx) =>
      trx
        .insertInto('users')
        .values({
          id: memberBId,
          tenant_id: tenantB,
          name: 'Member B',
          email: `m-${memberBId.slice(0, 6)}@b.com`,
          role: 'member',
          cognito_sub: memberBSub,
        })
        .execute(),
    );
  });

  afterAll(async () => {
    const db = createKysely();
    await withTenant(db, tenantA, (trx) =>
      trx.deleteFrom('activities').where('tenant_id', '=', tenantA).execute(),
    );
    await withTenant(db, tenantB, (trx) =>
      trx.deleteFrom('activities').where('tenant_id', '=', tenantB).execute(),
    );
    await withTenant(db, tenantA, (trx) =>
      trx.deleteFrom('users').where('tenant_id', '=', tenantA).execute(),
    );
    await withTenant(db, tenantB, (trx) =>
      trx.deleteFrom('users').where('tenant_id', '=', tenantB).execute(),
    );
    await sql`DELETE FROM tenants WHERE id IN (${tenantA}, ${tenantB})`.execute(db);

    await app?.close();
    await closeKysely();
  });

  function request(method: 'GET' | 'POST', url: string, headers: Record<string, string>, body?: unknown) {
    return app.getHttpAdapter().getInstance().inject({
      method,
      url,
      headers,
      payload: body != null ? JSON.stringify(body) : undefined,
    });
  }

  it('full happy path: create → list → assign → complete', async () => {
    const adminAuth = { authorization: `Bearer ${token(adminASub, tenantA, 'admin')}`, 'content-type': 'application/json' };
    const memberAuth = { authorization: `Bearer ${token(memberASub, tenantA, 'member')}`, 'content-type': 'application/json' };

    const created = await request('POST', '/activities', adminAuth, {
      title: 'Trocar óleo',
      description: '5W30',
    });
    expect(created.statusCode).toBe(201);
    const activity = JSON.parse(created.payload);
    expect(activity.status).toBe('pending');

    const listed = await request('GET', '/activities', adminAuth);
    expect(listed.statusCode).toBe(200);
    const arr = JSON.parse(listed.payload);
    expect(arr.find((a: { id: string }) => a.id === activity.id)).toBeDefined();

    const assigned = await request(
      'POST',
      `/activities/${activity.id}/assign`,
      adminAuth,
      { userId: memberAId },
    );
    expect(assigned.statusCode).toBe(200);
    expect(JSON.parse(assigned.payload).status).toBe('assigned');

    const completed = await request('POST', `/activities/${activity.id}/complete`, memberAuth);
    expect(completed.statusCode).toBe(200);
    expect(JSON.parse(completed.payload).status).toBe('completed');
  });

  it('returns 422 when completing an activity without assignee', async () => {
    const adminAuth = { authorization: `Bearer ${token(adminASub, tenantA, 'admin')}`, 'content-type': 'application/json' };
    const created = await request('POST', '/activities', adminAuth, { title: 'No assignee' });
    const activity = JSON.parse(created.payload);
    const res = await request('POST', `/activities/${activity.id}/complete`, adminAuth);
    expect(res.statusCode).toBe(422);
    expect(JSON.parse(res.payload).error).toBe('ACTIVITY_HAS_NO_ASSIGNEE');
  });

  it('returns 409 when assigning to a user that already has another activity', async () => {
    const adminAuth = { authorization: `Bearer ${token(adminASub, tenantA, 'admin')}`, 'content-type': 'application/json' };
    const first = JSON.parse((await request('POST', '/activities', adminAuth, { title: 'Busy 1' })).payload);
    const second = JSON.parse((await request('POST', '/activities', adminAuth, { title: 'Busy 2' })).payload);
    await request('POST', `/activities/${first.id}/assign`, adminAuth, { userId: memberAId });
    const res = await request('POST', `/activities/${second.id}/assign`, adminAuth, { userId: memberAId });
    expect(res.statusCode).toBe(409);
    expect(JSON.parse(res.payload).error).toBe('USER_ALREADY_HAS_ACTIVITY');
  });

  it('returns 403 when assigning to a user of another tenant', async () => {
    const adminAuth = { authorization: `Bearer ${token(adminASub, tenantA, 'admin')}`, 'content-type': 'application/json' };
    const created = JSON.parse((await request('POST', '/activities', adminAuth, { title: 'Cross tenant' })).payload);
    const res = await request('POST', `/activities/${created.id}/assign`, adminAuth, {
      userId: memberBId, // belongs to tenant B
    });
    expect(res.statusCode).toBe(403);
    expect(JSON.parse(res.payload).error).toBe('USER_NOT_BELONGS_TO_TENANT');
  });

  it('isolates tenants via RLS: tenant B cannot see tenant A activities', async () => {
    const adminAAuth = { authorization: `Bearer ${token(adminASub, tenantA, 'admin')}`, 'content-type': 'application/json' };
    await request('POST', '/activities', adminAAuth, { title: 'Secret A' });

    const memberBAuth = { authorization: `Bearer ${token(memberBSub, tenantB, 'member')}`, 'content-type': 'application/json' };
    const listed = await request('GET', '/activities', memberBAuth);
    expect(listed.statusCode).toBe(200);
    const arr = JSON.parse(listed.payload);
    for (const a of arr) expect(a.tenantId).toBe(tenantB);
  });

  it('returns 401 without a bearer token', async () => {
    const res = await request('GET', '/activities', { 'content-type': 'application/json' });
    expect(res.statusCode).toBe(401);
  });

  it('returns 403 when a member tries to create activities', async () => {
    const memberAuth = { authorization: `Bearer ${token(memberASub, tenantA, 'member')}`, 'content-type': 'application/json' };
    const res = await request('POST', '/activities', memberAuth, { title: 'nope' });
    expect(res.statusCode).toBe(403);
  });
});
