# Todolist POC — multi-tenant architecture playground

Multi-tenant todo list backend used to validate a reusable serverless
architecture pattern: **Light DDD + NestJS on Lambda + PostgreSQL with RLS +
independent module deploys**.

**Stack:** NestJS · Fastify · Kysely · AWS Lambda · API Gateway · Cognito ·
PostgreSQL · Docker · Serverless Framework v3.

## Repository layout

```
packages/
  shared/                     # DDD base, Kysely, Nest bootstrap, guards, filters
modules/
  tenants/                    # Lambda: POST /tenants, GET /tenants/:id
  users/                      # Lambda: POST /auth/login, /users
  activities/                 # Lambda: /activities, /assign, /complete
scripts/
  run-migrations.ts           # applies .sql files in order
  bootstrap-cognito.ts      # creates User Pool + SSM params
  e2e-demo.ts                 # full end-to-end happy path
  create-module.ts            # scaffold a new module (+ refresh root dev:all)
  remove-module.ts            # remove a module (+ refresh root dev:all)
  patch-dev-all.ts            # shared helper to recompute npm run dev:all
docker-compose.yml            # Postgres (dev)
docker-compose.test.yml     # dedicated test Postgres on port 5433
```

## Prerequisites

- Node.js 20+
- Docker + docker-compose
- npm 10+

## Quick start (local dev with Docker)

```bash
# 1. Bring up Postgres
npm run db:up
# or: docker-compose up -d

# 2. Install deps (uses npm workspaces)
npm install

# 3. Apply migrations explicitly (docker-compose also auto-seeds on first boot)
npm run db:migrate

# 4. Run modules — either one process or three terminals
AUTH_MODE=local npm run dev:all
# or:
AUTH_MODE=local npm run dev:tenants       # port 3001
AUTH_MODE=local npm run dev:users         # port 3002
AUTH_MODE=local npm run dev:activities    # port 3003

# 5. End-to-end demo (expects the three dev servers)
npm run demo
```

`AUTH_MODE=local` uses `LocalIdentityService` + `LocalHsJwtVerifier` (HS256
JWTs) with a shared secret (`JWT_LOCAL_SECRET`, default `local-dev-secret`).
Identities are persisted under `.local-auth/local-identity.json` (override with
`LOCAL_IDENTITY_FILE`).

## Other npm scripts

| Script | Purpose |
|--------|---------|
| `npm run build` / `typecheck` | TypeScript project references |
| `npm run lint` | ESLint on `packages/` and `modules/` |
| `npm test` / `test:unit` / `test:integration` / `test:cov` | Jest |
| `npm run create:module -- <slug>` | New Serverless module (see `scripts/create-module.ts`) |
| `npm run remove:module -- <slug>` | Remove a module tree |

## Using real AWS Cognito

`AUTH_MODE` defaults to `cognito` when a pool/client id is present. To provision
Cognito in your AWS account and store the pool/client ids in SSM (see
[`scripts/bootstrap-cognito.ts`](scripts/bootstrap-cognito.ts)):

```bash
# Configure AWS credentials / region in your environment first.
STAGE=dev AWS_REGION=us-east-1 npm run cognito:bootstrap
```

Point each module at the pool and client (via env vars or the `param:` values in
`serverless.yml` when deployed). For local `serverless offline` with Cognito,
export `COGNITO_USER_POOL_ID` and `COGNITO_CLIENT_ID` before `npm run dev:*`.

## Endpoints

### Tenants (port 3001)

| Method | Path | Auth | Role |
|--------|------|------|------|
| `POST` | `/tenants` | — | — |
| `GET`  | `/tenants/:id` | Bearer | any |

### Users (port 3002)

| Method | Path | Auth | Role |
|--------|------|------|------|
| `POST` | `/auth/login` | — | — |
| `POST` | `/users` | Bearer | admin |
| `GET`  | `/users` | Bearer | admin |

### Activities (port 3003)

| Method | Path | Auth | Role |
|--------|------|------|------|
| `POST` | `/activities` | Bearer | admin |
| `GET`  | `/activities` | Bearer | any |
| `POST` | `/activities/:id/assign` | Bearer | admin |
| `POST` | `/activities/:id/complete` | Bearer | any |

Manual API smoke test: see
[`requests/local-auth-e2e.http`](requests/local-auth-e2e.http) (REST Client in
VS Code / Cursor; follow the header comments).

## Tests

```bash
npm run test:unit

# Integration tests need the test database:
docker-compose -f docker-compose.test.yml up -d
npm run test:integration
```

## Deploy

Each module is deployed independently:

```bash
cd modules/tenants && npx serverless deploy --stage dev
cd ../users && npx serverless deploy --stage dev
cd ../activities && npx serverless deploy --stage dev
```

CI does this automatically via path-filtered GitHub Actions workflows:

- `.github/workflows/deploy-tenants.yml`
- `.github/workflows/deploy-users.yml`
- `.github/workflows/deploy-activities.yml`

## Architectural guarantees proven by this POC

| Concept | Where to see it |
|---------|-----------------|
| Light DDD | `modules/activities/src/domain/entities/activity.entity.ts` |
| Multi-tenant via RLS | `packages/shared/src/infrastructure/database/migrations/002_users.sql` + `withTenant` |
| Modular deploy | Three independent `serverless.yml` + three pipelines with `paths:` filters |
| Cold start optimized | `packages/shared/src/infrastructure/lambda/nest-bootstrap.ts` (cached promise) |
| Cognito JWT auth | `packages/shared/src/presentation/guards/jwt-auth.guard.ts` |
| Domain errors → HTTP | `packages/shared/src/presentation/filters/domain-error.filter.ts` |

## Further reading

- [docs/performance.md](docs/performance.md) — cold start metrics & Provisioned Concurrency policy
- [docs/retro.md](docs/retro.md) — retrospective after the POC
- [docs/presentation.md](docs/presentation.md) — speaking notes for the team demo
