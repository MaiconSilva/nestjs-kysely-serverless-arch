# Todolist POC — multi-tenant architecture playground

Multi-tenant todo list backend used to validate a reusable serverless
architecture pattern: **DDD Leve + NestJS on Lambda + PostgreSQL with RLS +
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
  bootstrap-cognito.ts        # creates User Pool + SSM params
  e2e-demo.ts                 # full end-to-end happy path
docker-compose.yml            # Postgres + LocalStack
docker-compose.test.yml       # dedicated test Postgres on port 5433
```

## Prerequisites

- Node.js 20+
- Docker + docker-compose
- npm 10+

## Quick start (local dev with Docker)

```bash
# 1. Bring up Postgres + LocalStack
docker-compose up -d

# 2. Install deps (uses npm workspaces)
npm install

# 3. Apply migrations explicitly (docker-compose also auto-seeds on first boot)
npm run db:migrate

# 4. Start each module in its own terminal
AUTH_MODE=local npm run dev:tenants       # port 3001
AUTH_MODE=local npm run dev:users         # port 3002
AUTH_MODE=local npm run dev:activities    # port 3003

# 5. In a fourth terminal, run the end-to-end demo
npm run demo
```

`AUTH_MODE=local` swaps the Cognito verifier/signer for an HS256 JWT with a
shared secret (`JWT_LOCAL_SECRET`, default `local-dev-secret`). Use it when
LocalStack's Cognito isn't up.

## Quick start (with Cognito on LocalStack)

```bash
docker-compose up -d
npm install
npm run db:migrate

COGNITO_ENDPOINT=http://localhost:4566 STAGE=local \
  npm run cognito:bootstrap

# Now start modules with default auth (cognito):
COGNITO_USER_POOL_ID=<from-above> \
COGNITO_CLIENT_ID=<from-above> \
COGNITO_ENDPOINT=http://localhost:4566 \
  npm run dev:tenants
# ...same for users and activities
```

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

A Postman/Insomnia collection is available at
[`docs/postman-collection.json`](docs/postman-collection.json).

## Tests

```bash
npm run test:unit            # fast, in-memory
npm run test:integration     # needs docker-compose.test.yml
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
| DDD Leve | `modules/activities/src/domain/entities/activity.entity.ts` |
| Multi-tenant via RLS | `packages/shared/src/infrastructure/database/migrations/002_users.sql` + `withTenant` |
| Modular deploy | Three independent `serverless.yml` + three pipelines with `paths:` filters |
| Cold start optimized | `packages/shared/src/infrastructure/lambda/nest-bootstrap.ts` (cached promise) |
| Cognito JWT auth | `packages/shared/src/presentation/guards/jwt-auth.guard.ts` |
| Domain errors → HTTP | `packages/shared/src/presentation/filters/domain-error.filter.ts` |

## Further reading

- [docs/performance.md](docs/performance.md) — cold start metrics & Provisioned Concurrency policy
- [docs/retro.md](docs/retro.md) — retrospective after the POC
- [docs/presentation.md](docs/presentation.md) — speaking notes for the team demo
