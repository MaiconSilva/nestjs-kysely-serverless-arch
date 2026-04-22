import { Tenant } from '../../domain/entities/tenant.entity';
import type { TenantsTable } from '@todolist/shared';
import type { Selectable } from 'kysely';

type TenantRow = Selectable<TenantsTable>;

export const TenantMapper = {
  toDomain(row: TenantRow): Tenant {
    const created = row.created_at;
    return Tenant.restore({
      id: row.id,
      name: row.name,
      slug: row.slug,
      active: row.active,
      createdAt: created instanceof Date ? created : new Date(String(created)),
    });
  },

  toPersistence(tenant: Tenant): {
    id: string;
    name: string;
    slug: string;
    active: boolean;
  } {
    const snap = tenant.toSnapshot();
    return {
      id: snap.id,
      name: snap.name,
      slug: snap.slug,
      active: snap.active,
    };
  },
};
