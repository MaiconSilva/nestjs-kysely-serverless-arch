import { DomainError, Email, TenantId, UserId } from '@todolist/shared';
import { Role, type RoleValue } from '../value-objects/role.vo';

class InvalidUserNameError extends DomainError {
  readonly code = 'INVALID_USER_NAME';
  readonly httpStatus = 400;
}

interface UserSnapshot {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: RoleValue;
  cognitoSub: string | null;
  active: boolean;
  createdAt: Date;
}

export class User {
  private constructor(
    public readonly id: UserId,
    public readonly tenantId: TenantId,
    private _name: string,
    public readonly email: Email,
    private _role: Role,
    private _cognitoSub: string | null,
    private _active: boolean,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    tenantId: string;
    name: string;
    email: string;
    role?: RoleValue;
    cognitoSub?: string | null;
  }): User {
    const name = props.name.trim();
    if (!name || name.length > 255) {
      throw new InvalidUserNameError('User name must be 1-255 characters');
    }
    return new User(
      UserId.generate(),
      TenantId.from(props.tenantId),
      name,
      Email.from(props.email),
      Role.from(props.role ?? 'member'),
      props.cognitoSub ?? null,
      true,
      new Date(),
    );
  }

  static restore(snapshot: UserSnapshot): User {
    return new User(
      UserId.from(snapshot.id),
      TenantId.from(snapshot.tenantId),
      snapshot.name,
      Email.from(snapshot.email),
      Role.from(snapshot.role),
      snapshot.cognitoSub,
      snapshot.active,
      snapshot.createdAt,
    );
  }

  get name(): string {
    return this._name;
  }
  get role(): Role {
    return this._role;
  }
  get cognitoSub(): string | null {
    return this._cognitoSub;
  }
  get active(): boolean {
    return this._active;
  }

  linkCognitoSub(sub: string): void {
    this._cognitoSub = sub;
  }

  deactivate(): void {
    this._active = false;
  }

  promoteToAdmin(): void {
    this._role = Role.ADMIN;
  }

  toSnapshot(): UserSnapshot {
    return {
      id: this.id.value,
      tenantId: this.tenantId.value,
      name: this._name,
      email: this.email.value,
      role: this._role.value,
      cognitoSub: this._cognitoSub,
      active: this._active,
      createdAt: this.createdAt,
    };
  }
}
