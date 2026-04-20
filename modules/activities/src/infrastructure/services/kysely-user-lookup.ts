import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY, withTenant, type DB } from '@todolist/shared';
import type { UserLookup } from '../../domain/services/user-lookup';

@Injectable()
export class KyselyUserLookup implements UserLookup {
  constructor(@Inject(KYSELY) private readonly db: Kysely<DB>) {}

  async findTenantOfUser(tenantId: string, userId: string): Promise<string | null> {
    // Scoping via `withTenant` means RLS filters the row out when the user
    // belongs to a different tenant — we don't need any extra check.
    const row = await withTenant(this.db, tenantId, (trx) =>
      trx
        .selectFrom('users')
        .select(['tenant_id'])
        .where('id', '=', userId)
        .where('active', '=', true)
        .executeTakeFirst(),
    );
    return row?.tenant_id ?? null;
  }

  async findUserIdBySub(tenantId: string, sub: string): Promise<string | null> {
    const row = await withTenant(this.db, tenantId, (trx) =>
      trx
        .selectFrom('users')
        .select(['id'])
        .where('cognito_sub', '=', sub)
        .where('active', '=', true)
        .executeTakeFirst(),
    );
    return row?.id ?? null;
  }
}
