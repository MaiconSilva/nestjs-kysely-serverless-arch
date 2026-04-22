import { DomainError, ValueObject } from '@todolist/shared';

export class InvalidRoleError extends DomainError {
  readonly code = 'INVALID_ROLE';
  readonly httpStatus = 400;
}

export type RoleValue = 'admin' | 'member';

interface RoleProps {
  value: RoleValue;
}

export class Role extends ValueObject<RoleProps> {
  static readonly ADMIN = new Role({ value: 'admin' });
  static readonly MEMBER = new Role({ value: 'member' });

  get value(): RoleValue {
    return this.props.value;
  }

  isAdmin(): boolean {
    return this.props.value === 'admin';
  }

  static from(raw: string): Role {
    if (raw === 'admin') return Role.ADMIN;
    if (raw === 'member') return Role.MEMBER;
    throw new InvalidRoleError(`Invalid role: ${raw}`);
  }
}
