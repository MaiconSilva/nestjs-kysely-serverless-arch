import { DomainError } from '@todolist/shared';

export class TenantNotFoundError extends DomainError {
  readonly code = 'TENANT_NOT_FOUND';
  readonly httpStatus = 404;
  constructor(id: string) {
    super(`Tenant not found: ${id}`);
  }
}

export class TenantSlugAlreadyExistsError extends DomainError {
  readonly code = 'TENANT_SLUG_ALREADY_EXISTS';
  readonly httpStatus = 409;
  constructor(slug: string) {
    super(`Slug already in use: ${slug}`);
  }
}

export class TenantInactiveError extends DomainError {
  readonly code = 'TENANT_INACTIVE';
  readonly httpStatus = 403;
  constructor(id: string) {
    super(`Tenant is inactive: ${id}`);
  }
}
