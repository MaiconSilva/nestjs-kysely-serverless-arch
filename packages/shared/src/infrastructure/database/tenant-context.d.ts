export interface TenantContext {
    tenantId: string;
    userId: string;
    role: 'admin' | 'member';
}
export declare const TenantContextStore: {
    run<T>(ctx: TenantContext, fn: () => T | Promise<T>): T | Promise<T>;
    getOrThrow(): TenantContext;
    tryGet(): TenantContext | undefined;
};
//# sourceMappingURL=tenant-context.d.ts.map