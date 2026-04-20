import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY, type DB } from '@todolist/shared';
import type { Tenant } from '../../domain/entities/tenant.entity';
import type { TenantRepository } from '../../domain/repositories/tenant.repository';
import { TenantMapper } from '../mappers/tenant.mapper';

@Injectable()
export class TenantKyselyRepository implements TenantRepository {
  constructor(@Inject(KYSELY) private readonly db: Kysely<DB>) {}

  // Tenants table has no RLS — administrative access is intentional.
  async findById(id: string): Promise<Tenant | null> {
    const row = await this.db
      .selectFrom('tenants')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    return row ? TenantMapper.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const row = await this.db
      .selectFrom('tenants')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirst();
    return row ? TenantMapper.toDomain(row) : null;
  }

  async save(tenant: Tenant): Promise<void> {
    const values = TenantMapper.toPersistence(tenant);
    await this.db
      .insertInto('tenants')
      .values(values)
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          name: values.name,
          active: values.active,
        }),
      )
      .execute();
  }
}
