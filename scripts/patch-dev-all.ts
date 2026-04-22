/**
 * Rebuilds root package.json "dev:all" from all "dev:<slug>" scripts that target
 * @todolist/<slug> (same convention as create-module).
 */
import * as fs from 'fs';
import * as path from 'path';

const REPO_ROOT = path.resolve(__dirname, '..');

const DEV_MODULE_SCRIPT = /^npm --workspace @todolist\/([a-z][a-z0-9-]*) run dev$/;
const DEV_KEY = /^dev:([a-z][a-z0-9-]*)$/;

/**
 * Return sorted slugs for module dev:* entries (excludes dev:all and non-workspace dev scripts).
 */
export function listModuleDevSlugs(scripts: Record<string, string> | undefined): string[] {
  if (!scripts) {
    return [];
  }
  const slugs: string[] = [];
  for (const [key, value] of Object.entries(scripts)) {
    if (key === 'dev:all' || !key.startsWith('dev:')) {
      continue;
    }
    const km = key.match(DEV_KEY);
    if (!km) {
      continue;
    }
    const slug = km[1]!;
    const vm = value.match(DEV_MODULE_SCRIPT);
    if (vm && vm[1] === slug) {
      slugs.push(slug);
    }
  }
  return slugs.sort((a, b) => a.localeCompare(b, 'en'));
}

/**
 * `concurrently -n a,b -c auto \"...\" ...` for each dev:<slug> workspace script.
 */
export function buildDevAllScript(slugs: string[]): string {
  if (slugs.length === 0) {
    return 'echo "No module dev:* scripts. Add one with: npm run create:module <kebab-slug>"';
  }
  const names = slugs.join(',');
  // Real double quotes around each subshell command; root package.json JSON.stringify will escape them.
  const tail = slugs.map((s) => `"AUTH_MODE=local npm run dev:${s}"`).join(' ');
  return `concurrently -n ${names} -c auto ${tail}`;
}

/**
 * Re-reads root package.json and sets `scripts['dev:all']` from listModuleDevSlugs(scripts). Mutates `scripts`.
 */
export function applyDevAllToRootPackageJson(scripts: Record<string, string>): { devAll: string; slugs: string[] } {
  const slugs = listModuleDevSlugs(scripts);
  const devAll = buildDevAllScript(slugs);
  scripts['dev:all'] = devAll;
  return { devAll, slugs };
}

/** Shallow-copies `scripts` then sets `dev:all` (for dry-run previews). */
export function computeDevAllForScripts(scripts: Record<string, string>): { devAll: string; slugs: string[] } {
  return applyDevAllToRootPackageJson({ ...scripts });
}

/**
 * As after create-module: root package.json on disk plus a new `dev:<slug>` (module not on disk yet in dry-run).
 */
export function previewDevAllWhenAddingModule(slug: string): { devAll: string; slugs: string[] } {
  const pkgPath = getRootPackageJsonPath();
  const raw = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw) as { scripts?: Record<string, string> } & Record<string, unknown>;
  const scripts: Record<string, string> = { ...(pkg.scripts ?? {}) };
  scripts[`dev:${slug}`] = `npm --workspace @todolist/${slug} run dev`;
  return computeDevAllForScripts(scripts);
}

/**
 * As after remove-module: same as disk but without `dev:<slug>`.
 */
export function previewDevAllWhenRemovingModule(slug: string): { devAll: string; slugs: string[] } {
  const pkgPath = getRootPackageJsonPath();
  const raw = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw) as { scripts?: Record<string, string> } & Record<string, unknown>;
  const scripts: Record<string, string> = { ...(pkg.scripts ?? {}) };
  delete scripts[`dev:${slug}`];
  return computeDevAllForScripts(scripts);
}

export function getRootPackageJsonPath(): string {
  return path.join(REPO_ROOT, 'package.json');
}

type RootPackage = { scripts?: Record<string, string> } & Record<string, unknown>;

/**
 * Read root package.json, recompute `dev:all` on `scripts`, write back. Does not add/remove individual dev:*.
 */
export function syncDevAllInRootPackageJson(dryRun: boolean, logPrefix = ''): { devAll: string; slugs: string[] } {
  const pkgPath = getRootPackageJsonPath();
  const raw = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw) as RootPackage;
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  const { devAll, slugs } = applyDevAllToRootPackageJson(pkg.scripts);
  if (dryRun) {
    console.log(
      `${logPrefix}[dry-run] Would set dev:all from module dev:* scripts: ${slugs.length ? slugs.join(', ') : '(none)'};`,
    );
    console.log(`${logPrefix}[dry-run]   ${devAll}`);
    return { devAll, slugs };
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  const rel = path.relative(REPO_ROOT, pkgPath);
  console.log(`${logPrefix}Patched ${rel}: dev:all (modules: ${slugs.length ? slugs.join(', ') : 'none'})`);
  return { devAll, slugs };
}
