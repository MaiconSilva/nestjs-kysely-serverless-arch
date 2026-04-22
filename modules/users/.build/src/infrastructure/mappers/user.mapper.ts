import type { Selectable } from 'kysely';
import type { UsersTable } from '@todolist/shared';
import { User } from '../../domain/entities/user.entity';
import type { RoleValue } from '../../domain/value-objects/role.vo';

type UserRow = Selectable<UsersTable>;

export const UserMapperLike = {
  toDomain(row: UserRow): User {
    const created = row.created_at;
    return User.restore({
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      email: row.email,
      role: row.role as RoleValue,
      cognitoSub: row.cognito_sub,
      active: row.active,
      createdAt: created instanceof Date ? created : new Date(String(created)),
    });
  },

  toPersistence(user: User): {
    id: string;
    tenant_id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    cognito_sub: string | null;
    active: boolean;
  } {
    const snap = user.toSnapshot();
    return {
      id: snap.id,
      tenant_id: snap.tenantId,
      name: snap.name,
      email: snap.email,
      role: snap.role,
      cognito_sub: snap.cognitoSub,
      active: snap.active,
    };
  },
};

export const UserMapper = UserMapperLike;
