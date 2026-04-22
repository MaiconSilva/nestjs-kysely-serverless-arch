import { DomainError } from '@todolist/shared';

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  readonly httpStatus = 404;
  constructor(idOrEmail: string) {
    super(`User not found: ${idOrEmail}`);
  }
}

export class EmailAlreadyExistsError extends DomainError {
  readonly code = 'EMAIL_ALREADY_EXISTS';
  readonly httpStatus = 409;
  constructor(email: string) {
    super(`Email already registered in this tenant: ${email}`);
  }
}

export class InvalidCredentialsError extends DomainError {
  readonly code = 'INVALID_CREDENTIALS';
  readonly httpStatus = 401;
  constructor() {
    super('Invalid email or password');
  }
}

export class UserNotBelongsToTenantError extends DomainError {
  readonly code = 'USER_NOT_BELONGS_TO_TENANT';
  readonly httpStatus = 403;
  constructor() {
    super('User does not belong to the requested tenant');
  }
}

export class TenantInactiveLoginError extends DomainError {
  readonly code = 'TENANT_INACTIVE';
  readonly httpStatus = 403;
  constructor() {
    super('Tenant is inactive — login blocked');
  }
}
