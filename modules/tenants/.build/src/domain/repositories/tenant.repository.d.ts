import type { Tenant } from '../entities/tenant.entity';
export declare const TENANT_REPOSITORY: unique symbol;
export interface TenantRepository {
    findById(id: string): Promise<Tenant | null>;
    findBySlug(slug: string): Promise<Tenant | null>;
    save(tenant: Tenant): Promise<void>;
}
//# sourceMappingURL=tenant.repository.d.ts.map