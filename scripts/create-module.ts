/**
 * Scaffolds a new Nest + Serverless module under modules/<slug>/.
 *
 * Usage: ts-node scripts/create-module.ts <kebab-slug> [--dry-run] [--http-port N] [--lambda-port N]
 *
 * @example npm run create:module -- reports
 */
import * as fs from 'fs';
import * as path from 'path';
import { previewDevAllWhenAddingModule, syncDevAllInRootPackageJson } from './patch-dev-all';

const REPO_ROOT = path.resolve(__dirname, '..');
const SLUG_RE = /^[a-z][a-z0-9-]*$/;

function kebabToPascal(slug: string): string {
  return slug
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('');
}

function parseArgs(argv: string[]): {
  slug: string;
  dryRun: boolean;
  httpPort: number | null;
  lambdaPort: number | null;
} {
  const rest: string[] = [];
  let dryRun = false;
  let httpPort: number | null = null;
  let lambdaPort: number | null = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === '--dry-run') {
      dryRun = true;
    } else if (a === '--http-port' && argv[i + 1]) {
      httpPort = parseInt(argv[++i]!, 10);
    } else if (a === '--lambda-port' && argv[i + 1]) {
      lambdaPort = parseInt(argv[++i]!, 10);
    } else if (!a.startsWith('-')) {
      rest.push(a);
    }
  }
  const slug = rest[0];
  if (!slug) {
    console.error('Usage: ts-node scripts/create-module.ts <kebab-slug> [--dry-run] [--http-port N] [--lambda-port N]');
    process.exit(1);
  }
  if (!SLUG_RE.test(slug)) {
    console.error(
      `Invalid slug "${slug}". Use kebab-case: lowercase letters, digits, single hyphens; must start with a letter (e.g. reports, user-profiles).`,
    );
    process.exit(1);
  }
  if (['packages', 'shared', 'node_modules'].includes(slug)) {
    console.error(`Reserved slug: ${slug}`);
    process.exit(1);
  }
  return { slug, dryRun, httpPort, lambdaPort };
}

function scanMaxPorts(modulesDir: string): { maxHttp: number; maxLambda: number } {
  let maxHttp = 3000;
  let maxLambda = 3000;
  if (!fs.existsSync(modulesDir)) {
    return { maxHttp, maxLambda };
  }
  for (const ent of fs.readdirSync(modulesDir, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const yml = path.join(modulesDir, ent.name, 'serverless.yml');
    if (!fs.existsSync(yml)) continue;
    const text = fs.readFileSync(yml, 'utf8');
    const hm = text.match(/httpPort:\s*(\d+)/);
    if (hm) maxHttp = Math.max(maxHttp, parseInt(hm[1]!, 10));
    const lm = text.match(/lambdaPort:\s*(\d+)/);
    if (lm) maxLambda = Math.max(maxLambda, parseInt(lm[1]!, 10));
  }
  return { maxHttp, maxLambda };
}

function writeFile(
  filePath: string,
  content: string,
  dryRun: boolean,
  planned: { path: string; content: string }[],
): void {
  if (dryRun) {
    planned.push({ path: filePath, content });
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function touchGitkeep(
  filePath: string,
  dryRun: boolean,
  planned: { path: string; content: string }[],
): void {
  writeFile(filePath, '', dryRun, planned);
}

function main(): void {
  const argv = process.argv.slice(2);
  const { slug, dryRun, httpPort: optHttp, lambdaPort: optLambda } = parseArgs(argv);
  const pascal = kebabToPascal(slug);
  const pascalModule = `${pascal}Module`;
  const pascalHealth = `${pascal}HealthController`;

  const modDir = path.join(REPO_ROOT, 'modules', slug);
  if (fs.existsSync(modDir)) {
    console.error(`Refusing to overwrite: ${modDir} already exists.`);
    process.exit(1);
  }

  const { maxHttp, maxLambda } = scanMaxPorts(path.join(REPO_ROOT, 'modules'));
  const nextHttp = optHttp ?? maxHttp + 1;
  const nextLambda = optLambda ?? maxLambda + 1;
  if (!Number.isFinite(nextHttp) || !Number.isFinite(nextLambda) || nextHttp < 1 || nextLambda < 1) {
    console.error('Invalid port values.');
    process.exit(1);
  }

  const serviceName = `todolist-${slug}`;
  const workspaceName = `@todolist/${slug}`;
  const handlerFile = `${slug}-handler.ts`;
  const moduleFile = `${slug}.module.ts`;
  const healthPath = `/${slug}/health`;

  const packageJson = {
    name: workspaceName,
    version: '1.0.0',
    private: true,
    main: 'src/index.ts',
    scripts: {
      build: 'tsc -b',
      predev: 'npx tsc -b ../../packages/shared',
      dev: 'node -e "const fs=require(\'fs\'),p=\'.build\';if(fs.existsSync(p))fs.rmSync(p,{recursive:true})" && serverless offline --stage local',
      deploy: 'serverless deploy --stage ${STAGE:-dev}',
      test: 'jest --selectProjects unit --roots $(pwd)',
    },
    dependencies: {
      '@todolist/shared': '1.0.0',
      '@nestjs/common': '^10.3.8',
      '@nestjs/core': '^10.3.8',
      '@nestjs/platform-fastify': '^10.3.8',
      'class-transformer': '^0.5.1',
      'class-validator': '^0.14.1',
      kysely: '^0.27.3',
      'reflect-metadata': '^0.2.2',
    },
    devDependencies: {
      serverless: '^3.38.0',
      'serverless-offline': '^13.3.3',
      'serverless-plugin-typescript': '^2.1.5',
    },
  };

  const tsconfigJson = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      rootDir: 'src',
      outDir: 'dist',
      tsBuildInfoFile: 'dist/.tsbuildinfo',
    },
    include: ['src/**/*.ts'],
    exclude: ['node_modules', 'dist', '**/*.spec.ts'],
    references: [{ path: '../../packages/shared' }],
  };

  const serverlessYml = `service: ${serviceName}

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs20.x
  stage: \${opt:stage, 'dev'}
  region: \${opt:region, 'us-east-1'}
  memorySize: 512
  timeout: 15
  architecture: arm64
  environment:
    NODE_OPTIONS: --enable-source-maps
    STAGE: \${sls:stage}

    PG_HOST: \${env:PG_HOST, param:PG_HOST}
    PG_PORT: \${env:PG_PORT, param:PG_PORT}
    PG_DATABASE: \${env:PG_DATABASE, param:PG_DATABASE}
    PG_USER: \${env:PG_USER, param:PG_USER}
    PG_PASSWORD: \${env:PG_PASSWORD, param:PG_PASSWORD}
    PG_MAX_CONNECTIONS: '2'

    AUTH_MODE: \${env:AUTH_MODE, 'cognito'}
    COGNITO_USER_POOL_ID: \${env:COGNITO_USER_POOL_ID, param:COGNITO_USER_POOL_ID}
    COGNITO_CLIENT_ID: \${env:COGNITO_CLIENT_ID, param:COGNITO_CLIENT_ID}
    JWT_LOCAL_SECRET: \${env:JWT_LOCAL_SECRET, 'local-dev-secret'}

plugins:
  - serverless-plugin-typescript
  - serverless-offline

custom:
  serverless-offline:
    httpPort: ${nextHttp}
    lambdaPort: ${nextLambda}

params:
  default:
    PG_HOST: localhost
    PG_PORT: '5432'
    PG_DATABASE: todo_dev
    PG_USER: todo
    PG_PASSWORD: todo123
    COGNITO_USER_POOL_ID: dummy
    COGNITO_CLIENT_ID: dummy

  local:
    PG_HOST: localhost
    PG_PORT: '5432'
    PG_DATABASE: todo_dev
    PG_USER: todo
    PG_PASSWORD: todo123
    COGNITO_USER_POOL_ID: dummy
    COGNITO_CLIENT_ID: dummy

package:
  individually: true
  patterns:
    - 'src/**'
    - '../../packages/shared/dist/**'
    - '../../tsconfig.base.json'

functions:
  health:
    handler: src/presentation/handlers/${slug}-handler.handler
    events:
      - httpApi:
          path: ${healthPath}
          method: GET
`;

  const healthControllerTs = `import { Controller, Get } from '@nestjs/common';
import { Public } from '@todolist/shared';

@Controller('${slug}')
export class ${pascalHealth} {
  @Public()
  @Get('health')
  health(): { status: string; ts: string } {
    return { status: 'ok', ts: new Date().toISOString() };
  }
}
`;

  const nestModuleTs = `import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RoleGuard } from '@todolist/shared';
import { ${pascalHealth} } from './controllers/health.controller';

@Module({
  // Import KyselyModule from @todolist/shared when you add Kysely repositories in this service.
  imports: [],
  controllers: [${pascalHealth}],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class ${pascalModule} {}
`;

  const handlerTs = `import { createLambdaHandler } from '@todolist/shared';
import { ${pascalModule} } from '../${slug}.module';

export const handler = createLambdaHandler(${pascalModule});
`;

  const indexTs = `export { ${pascalModule} } from './presentation/${slug}.module';
export { handler } from './presentation/handlers/${slug}-handler';
`;

  const planned: { path: string; content: string }[] = [];

  const write = (rel: string, content: string) =>
    writeFile(path.join(modDir, rel), content, dryRun, planned);

  write('package.json', JSON.stringify(packageJson, null, 2) + '\n');
  write('tsconfig.json', JSON.stringify(tsconfigJson, null, 2) + '\n');
  write('serverless.yml', serverlessYml);
  write(`src/presentation/${moduleFile}`, nestModuleTs);
  write('src/presentation/controllers/health.controller.ts', healthControllerTs);
  write(`src/presentation/handlers/${handlerFile}`, handlerTs);
  write('src/index.ts', indexTs);

  const gitkeepDirs = [
    'src/application/dtos',
    'src/application/use-cases',
    'src/domain/entities',
    'src/domain/value-objects',
    'src/domain/errors',
    'src/domain/repositories',
    'src/infrastructure/mappers',
    'src/infrastructure/repositories',
  ];
  for (const d of gitkeepDirs) {
    touchGitkeep(path.join(modDir, d, '.gitkeep'), dryRun, planned);
  }

  if (dryRun) {
    console.log(`[dry-run] Would create module "${slug}" at modules/${slug}/\n`);
    console.log(`Next serverless-offline ports: http=${nextHttp} lambda=${nextLambda} (override with --http-port / --lambda-port)\n`);
    for (const p of planned) {
      const rel = path.relative(REPO_ROOT, p.path);
      console.log(`  ${rel} (${p.content.length} bytes)`);
    }
    const { devAll, slugs } = previewDevAllWhenAddingModule(slug);
    console.log('\n[Would patch] tsconfig.json references + root package.json (create:module, dev:*, dev:all)');
    console.log(`[dry-run] Would set dev:all (modules: ${slugs.length ? slugs.join(', ') : 'none'})`);
    console.log(`[dry-run]   ${devAll}`);
    return;
  }

  patchRootTsconfig(slug);
  patchRootPackageJson(slug);
  syncDevAllInRootPackageJson(false);

  console.log(`Created module ${workspaceName} at modules/${slug}/`);
  console.log(`  serverless-offline: httpPort=${nextHttp} lambdaPort=${nextLambda}`);
  console.log(`  Public GET: http://localhost:${nextHttp}${healthPath}`);
  console.log('');
  console.log('Next:');
  console.log('  1) npm install (at repo root) if needed');
  console.log('  2) npm run build  # or: npm run build --workspace ' + workspaceName);
  console.log('  3) Add migrations in packages/shared/.../migrations/ when you introduce tables (see ARCHITECTURE.md section 6)');
  console.log('  4) Optional: .github/workflows/deploy-' + slug + '.yml');
}

const SHARED_REF = './packages/shared';

function patchRootTsconfig(slug: string): void {
  const tsconfigPath = path.join(REPO_ROOT, 'tsconfig.json');
  const raw = fs.readFileSync(tsconfigPath, 'utf8');
  const data = JSON.parse(raw) as { extends?: string; files?: string[]; references: { path: string }[] };
  const refPath = `./modules/${slug}`;
  if (data.references.some((r) => r.path === refPath)) {
    return;
  }
  data.references.push({ path: refPath });
  const shared = data.references.find((r) => r.path === SHARED_REF);
  const modulesOnly = data.references.filter((r) => r.path !== SHARED_REF);
  modulesOnly.sort((a, b) => a.path.localeCompare(b.path, 'en'));
  data.references = shared ? [shared, ...modulesOnly] : modulesOnly;
  fs.writeFileSync(tsconfigPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Patched ${path.relative(REPO_ROOT, tsconfigPath)}: added reference ${refPath}`);
}

function patchRootPackageJson(slug: string): void {
  const pkgPath = path.join(REPO_ROOT, 'package.json');
  const out = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { scripts: Record<string, string> };
  if (!out.scripts) out.scripts = {};
  if (!out.scripts['create:module']) {
    out.scripts['create:module'] = 'ts-node scripts/create-module.ts';
  }
  const devKey = `dev:${slug}`;
  if (!out.scripts[devKey]) {
    out.scripts[devKey] = `npm --workspace @todolist/${slug} run dev`;
  }
  fs.writeFileSync(pkgPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(
    `Patched ${path.relative(REPO_ROOT, pkgPath)}: create:module, ${devKey}`,
  );
}

main();
