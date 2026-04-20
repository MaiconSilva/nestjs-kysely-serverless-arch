import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY, withTenant, type DB } from '@todolist/shared';
import type { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserKyselyRepository implements UserRepository {
  constructor(@Inject(KYSELY) private readonly db: Kysely<DB>) {}

  async findByIdInTenant(tenantId: string, id: string): Promise<User | null> {
    const row = await withTenant(this.db, tenantId, (trx) =>
      trx.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst(),
    );
    return row ? UserMapper.toDomain(row) : null;
  }

  async findByEmailInTenant(tenantId: string, email: string): Promise<User | null> {
    const row = await withTenant(this.db, tenantId, (trx) =>
      trx.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst(),
    );
    return row ? UserMapper.toDomain(row) : null;
  }

  /**
   * Login path: the tenant context must have been set by the caller before
   * invoking this method (see `LoginUseCase`, which sets it from the verified
   * JWT). Used by `@todolist/activities` and internal code paths that already
   * know the tenant.
   */
  async findByCognitoSub(sub: string): Promise<User | null> {
    // Whoever calls this outside a tenant context gets no rows because RLS
    // hides them — that's intentional, we only look up by sub when we already
    // know the tenant (post-auth).
    const row = await this.db
      .selectFrom('users')
      .selectAll()
      .where('cognito_sub', '=', sub)
      .executeTakeFirst();
    return row ? UserMapper.toDomain(row) : null;
  }

  async listByTenant(tenantId: string): Promise<User[]> {
    const rows = await withTenant(this.db, tenantId, (trx) =>
      trx.selectFrom('users').selectAll().orderBy('created_at', 'asc').execute(),
    );
    return rows.map(UserMapper.toDomain);
  }

  async save(user: User): Promise<void> {
    const values = UserMapper.toPersistence(user);
    await withTenant(this.db, values.tenant_id, (trx) =>
      trx
        .insertInto('users')
        .values(values)
        .onConflict((oc) =>
          oc.columns(['tenant_id', 'email']).doUpdateSet({
            name: values.name,
            role: values.role,
            cognito_sub: values.cognito_sub,
            active: values.active,
          }),
        )
        .execute(),
    );
  }
}
