import { Kysely } from 'kysely';
import { type DB } from '@todolist/shared';
import type { Tenant } from '../../domain/entities/tenant.entity';
import type { TenantRepository } from '../../domain/repositories/tenant.repository';
export declare class TenantKyselyRepository implements TenantRepository {
    private readonly db;
    constructor(db: Kysely<DB>);
    findById(id: string): Promise<Tenant | null>;
    findBySlug(slug: string): Promise<Tenant | null>;
    save(tenant: Tenant): Promise<void>;
}
//# sourceMappingURL=tenant.kysely.repository.d.ts.map