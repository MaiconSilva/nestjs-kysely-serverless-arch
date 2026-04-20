import { Tenant } from '../../domain/entities/tenant.entity';
import type { TenantsTable } from '@todolist/shared';
import type { Selectable } from 'kysely';

type TenantRow = Selectable<TenantsTable>;

export const TenantMapper = {
  toDomain(row: TenantRow): Tenant {
    return Tenant.restore({
      id: row.id,
      name: row.name,
      slug: row.slug,
      active: row.active,
      createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
    });
  },

  toPersistence(tenant: Tenant): {
    id: string;
    name: string;
    slug: string;
    active: boolean;
    created_at: Date;
  } {
    const snap = tenant.toSnapshot();
    return {
      id: snap.id,
      name: snap.name,
      slug: snap.slug,
      active: snap.active,
      created_at: snap.createdAt,
    };
  },
};
