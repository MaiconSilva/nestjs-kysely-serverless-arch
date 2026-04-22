import { Tenant } from '../../domain/entities/tenant.entity';
import type { TenantsTable } from '@todolist/shared';
import type { Selectable } from 'kysely';
type TenantRow = Selectable<TenantsTable>;
export declare const TenantMapper: {
    toDomain(row: TenantRow): Tenant;
    toPersistence(tenant: Tenant): {
        id: string;
        name: string;
        slug: string;
        active: boolean;
    };
};
export {};
//# sourceMappingURL=tenant.mapper.d.ts.map