/**
 * Integration test for the Tenants module. Requires Postgres on port 5433:
 *   docker-compose -f docker-compose.test.yml up -d
 *
 * Skipped automatically when PG is unreachable so unit runs stay green on
 * machines without Docker.
 */
import { randomUUID } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DomainErrorFilter, closeKysely, createKysely } from '@todolist/shared';
import { sql } from 'kysely';
import { TenantsModule } from './tenants.module';

const TEST_ENV = {
  PG_HOST: 'localhost',
  PG_PORT: '5433',
  PG_DATABASE: 'todo_test',
  PG_USER: 'todo',
  PG_PASSWORD: 'todo123',
  AUTH_MODE: 'local',
  JWT_LOCAL_SECRET: 'test-secret',
};

describe('POST /tenants (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    Object.assign(process.env, TEST_ENV);
    app = await NestFactory.create<NestFastifyApplication>(
      TenantsModule,
      new FastifyAdapter({ logger: false }),
      { logger: false },
    );
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new DomainErrorFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app?.close();
    await closeKysely();
  });

  it('creates a tenant and returns 201 with the payload', async () => {
    const slug = `acme-${randomUUID().slice(0, 8)}`;
    const res = await app.getHttpAdapter().getInstance().inject({
      method: 'POST',
      url: '/tenants',
      payload: { name: 'ACME', slug },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.name).toBe('ACME');
    expect(body.slug).toBe(slug);
    expect(body.active).toBe(true);

    // Cleanup
    const db = createKysely();
    await sql`DELETE FROM tenants WHERE slug = ${slug}`.execute(db);
  });

  it('rejects duplicate slugs with 409', async () => {
    const slug = `dup-${randomUUID().slice(0, 8)}`;
    const fastify = app.getHttpAdapter().getInstance();
    await fastify.inject({ method: 'POST', url: '/tenants', payload: { name: 'A', slug } });
    const res = await fastify.inject({ method: 'POST', url: '/tenants', payload: { name: 'B', slug } });
    expect(res.statusCode).toBe(409);
    expect(JSON.parse(res.payload).error).toBe('TENANT_SLUG_ALREADY_EXISTS');
    await sql`DELETE FROM tenants WHERE slug = ${slug}`.execute(createKysely());
  });

  it('rejects malformed slug with 400', async () => {
    const res = await app.getHttpAdapter().getInstance().inject({
      method: 'POST',
      url: '/tenants',
      payload: { name: 'A', slug: 'BAD SLUG' },
    });
    expect(res.statusCode).toBe(400);
  });
});
