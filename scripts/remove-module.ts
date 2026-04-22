/**
 * Removes a module scaffolded under modules/<kebab-slug>/ and reverts create-module root patches.
 *
 * Usage: ts-node scripts/remove-module.ts <kebab-slug> [--dry-run] [--no-install]
 *
 * @example npm run remove:module -- tickets
 */
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { previewDevAllWhenRemovingModule, syncDevAllInRootPackageJson } from './patch-dev-all';

const REPO_ROOT = path.resolve(__dirname, '..');
const SLUG_RE = /^[a-z][a-z0-9-]*$/;

function parseArgs(argv: string[]): { slug: string; dryRun: boolean; noInstall: boolean } {
  const rest: string[] = [];
  let dryRun = false;
  let noInstall = false;
  for (const a of argv) {
    if (a === '--dry-run') {
      dryRun = true;
    } else if (a === '--no-install') {
      noInstall = true;
    } else if (!a.startsWith('-')) {
      rest.push(a);
    }
  }
  const slug = rest[0];
  if (!slug) {
    console.error('Usage: ts-node scripts/remove-module.ts <kebab-slug> [--dry-run] [--no-install]');
    process.exit(1);
  }
  if (!SLUG_RE.test(slug)) {
    console.error(
      `Invalid slug "${slug}". Use kebab-case: lowercase letters, digits, single hyphens; must start with a letter.`,
    );
    process.exit(1);
  }
  return { slug, dryRun, noInstall };
}

function removeRefFromRootTsconfig(slug: string, dryRun: boolean): boolean {
  const tsconfigPath = path.join(REPO_ROOT, 'tsconfig.json');
  const refPath = `./modules/${slug}`;
  const raw = fs.readFileSync(tsconfigPath, 'utf8');
  const data = JSON.parse(raw) as { extends?: string; files?: string[]; references: { path: string }[] };
  if (!data.references?.length) {
    return false;
  }
  const before = data.references.length;
  data.references = data.references.filter((r) => r.path !== refPath);
  if (data.references.length === before) {
    return false;
  }
  if (!dryRun) {
    fs.writeFileSync(tsconfigPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`Patched ${path.relative(REPO_ROOT, tsconfigPath)}: removed reference ${refPath}`);
  } else {
    console.log(`[dry-run] Would remove from tsconfig.json: ${refPath}`);
  }
  return true;
}

function removeDevScriptFromRootPackageJson(slug: string, dryRun: boolean): boolean {
  const pkgPath = path.join(REPO_ROOT, 'package.json');
  const devKey = `dev:${slug}`;
  const out = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { scripts: Record<string, string> };
  if (!out.scripts || !(devKey in out.scripts)) {
    return false;
  }
  if (!dryRun) {
    delete out.scripts[devKey];
    fs.writeFileSync(pkgPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log(`Patched ${path.relative(REPO_ROOT, pkgPath)}: removed script ${devKey}`);
  } else {
    console.log(`[dry-run] Would remove from package.json scripts: ${devKey}`);
  }
  return true;
}

function main(): void {
  const { slug, dryRun, noInstall } = parseArgs(process.argv.slice(2));
  const modDir = path.join(REPO_ROOT, 'modules', slug);

  if (dryRun) {
    console.log(`[dry-run] Would remove module "modules/${slug}/"\n`);
  }

  if (fs.existsSync(modDir)) {
    if (dryRun) {
      console.log(`[dry-run] Would delete directory: ${path.relative(REPO_ROOT, modDir)}`);
    } else {
      fs.rmSync(modDir, { recursive: true, force: true });
      console.log(`Deleted ${path.relative(REPO_ROOT, modDir)}`);
    }
  } else {
    console.warn(`No directory at ${path.relative(REPO_ROOT, modDir)} (continuing to clean root config)`);
  }

  removeRefFromRootTsconfig(slug, dryRun);
  removeDevScriptFromRootPackageJson(slug, dryRun);
  if (dryRun) {
    const { devAll, slugs } = previewDevAllWhenRemovingModule(slug);
    console.log(`[dry-run] Would set dev:all (modules: ${slugs.length ? slugs.join(', ') : 'none'})`);
    console.log(`[dry-run]   ${devAll}`);
  } else {
    syncDevAllInRootPackageJson(false);
  }

  if (dryRun) {
    if (!noInstall) {
      console.log('[dry-run] Would run: npm install (at repo root) to refresh package-lock');
    }
    return;
  }

  if (!noInstall) {
    console.log('Running npm install to refresh lockfile and workspaces...');
    execSync('npm install', { cwd: REPO_ROOT, stdio: 'inherit' });
  } else {
    console.log('Skipped npm install (--no-install). Run npm install at the repo root when ready.');
  }

  console.log(`\nRemoved module @todolist/${slug}.`);
  console.log('If you had CI (e.g. .github/workflows) for this module, remove the workflow file manually.');
}

main();
