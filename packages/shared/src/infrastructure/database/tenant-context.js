"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantContextStore = void 0;
const async_hooks_1 = require("async_hooks");
/**
 * Request-scoped tenant context. Populated by `JwtAuthGuard` on every
 * authenticated request and read anywhere in the call stack (repositories,
 * domain services) without having to plumb it through function arguments.
 */
const storage = new async_hooks_1.AsyncLocalStorage();
exports.TenantContextStore = {
    run(ctx, fn) {
        return storage.run(ctx, fn);
    },
    getOrThrow() {
        const ctx = storage.getStore();
        if (!ctx)
            throw new Error('TenantContext is not set — request is unauthenticated?');
        return ctx;
    },
    tryGet() {
        return storage.getStore();
    },
};
//# sourceMappingURL=tenant-context.js.map