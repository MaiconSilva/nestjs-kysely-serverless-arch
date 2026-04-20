import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY, withTenant, type DB } from '@todolist/shared';
import {
  InvalidCredentialsError,
  TenantInactiveLoginError,
  UserNotFoundError,
} from '../../domain/errors/user.errors';
import { UserMapperLike } from '../../infrastructure/mappers/user.mapper';
import {
  IDENTITY_PROVIDER,
  type IdentityProvider,
} from '../../domain/services/identity-provider';
import type { LoginInput, LoginOutput } from '../dtos/user.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider,
    @Inject(KYSELY) private readonly db: Kysely<DB>,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    let auth;
    try {
      auth = await this.identity.authenticate({
        email: input.email.trim().toLowerCase(),
        password: input.password,
      });
    } catch {
      throw new InvalidCredentialsError();
    }

    // Tenant id comes straight from the verified Cognito token — we trust it
    // because `authenticate()` validated the signature.
    const tenantRow = await this.db
      .selectFrom('tenants')
      .select(['id', 'active'])
      .where('id', '=', auth.tenantId)
      .executeTakeFirst();
    if (!tenantRow) throw new TenantInactiveLoginError();
    if (!tenantRow.active) throw new TenantInactiveLoginError();

    // RLS is satisfied: we scope the user lookup by the tenant from the token.
    const userRow = await withTenant(this.db, auth.tenantId, (trx) =>
      trx
        .selectFrom('users')
        .selectAll()
        .where('cognito_sub', '=', auth.sub)
        .executeTakeFirst(),
    );
    if (!userRow) throw new UserNotFoundError(auth.sub);
    const user = UserMapperLike.toDomain(userRow);
    const snap = user.toSnapshot();

    return {
      accessToken: auth.accessToken,
      idToken: auth.idToken,
      refreshToken: auth.refreshToken,
      expiresIn: auth.expiresIn,
      user: {
        id: snap.id,
        tenantId: snap.tenantId,
        name: snap.name,
        email: snap.email,
        role: snap.role,
      },
    };
  }
}
