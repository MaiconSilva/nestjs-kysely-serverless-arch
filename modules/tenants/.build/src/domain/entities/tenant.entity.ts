import { DomainError, TenantId } from '@todolist/shared';
import { Slug } from '../value-objects/slug.vo';

class InvalidTenantNameError extends DomainError {
  readonly code = 'INVALID_TENANT_NAME';
  readonly httpStatus = 400;
}

interface TenantSnapshot {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: Date;
}

export class Tenant {
  private constructor(
    public readonly id: TenantId,
    private _name: string,
    public readonly slug: Slug,
    private _active: boolean,
    public readonly createdAt: Date,
  ) {}

  static create(props: { name: string; slug: string }): Tenant {
    const name = props.name.trim();
    if (!name || name.length > 255) {
      throw new InvalidTenantNameError('Tenant name must be 1-255 characters');
    }
    return new Tenant(
      TenantId.generate(),
      name,
      Slug.from(props.slug),
      true,
      new Date(),
    );
  }

  static restore(snapshot: TenantSnapshot): Tenant {
    return new Tenant(
      TenantId.from(snapshot.id),
      snapshot.name,
      Slug.from(snapshot.slug),
      snapshot.active,
      snapshot.createdAt,
    );
  }

  get name(): string {
    return this._name;
  }

  get active(): boolean {
    return this._active;
  }

  deactivate(): void {
    this._active = false;
  }

  reactivate(): void {
    this._active = true;
  }

  toSnapshot(): TenantSnapshot {
    return {
      id: this.id.value,
      name: this._name,
      slug: this.slug.value,
      active: this._active,
      createdAt: this.createdAt,
    };
  }
}
