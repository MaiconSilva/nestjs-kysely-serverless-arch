import type { Tenant } from '../../domain/entities/tenant.entity';
import type { TenantOutput } from '../dtos/create-tenant.input';

export function toOutput(tenant: Tenant): TenantOutput {
  const snap = tenant.toSnapshot();
  return {
    id: snap.id,
    name: snap.name,
    slug: snap.slug,
    active: snap.active,
    createdAt: snap.createdAt.toISOString(),
  };
}
