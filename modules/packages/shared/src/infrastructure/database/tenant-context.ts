import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: 'admin' | 'member';
}

/**
 * Request-scoped tenant context. Populated by `JwtAuthGuard` on every
 * authenticated request and read anywhere in the call stack (repositories,
 * domain services) without having to plumb it through function arguments.
 */
const storage = new AsyncLocalStorage<TenantContext>();

export const TenantContextStore = {
  run<T>(ctx: TenantContext, fn: () => T | Promise<T>): T | Promise<T> {
    return storage.run(ctx, fn);
  },

  getOrThrow(): TenantContext {
    const ctx = storage.getStore();
    if (!ctx) throw new Error('TenantContext is not set — request is unauthenticated?');
    return ctx;
  },

  tryGet(): TenantContext | undefined {
    return storage.getStore();
  },
};
