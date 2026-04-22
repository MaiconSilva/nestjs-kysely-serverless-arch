import { randomUUID } from 'crypto';
import { ValueObject } from '../value-object.base';
import { DomainError } from '../domain-error.base';

export class InvalidTenantIdError extends DomainError {
  readonly code = 'INVALID_TENANT_ID';
  readonly httpStatus = 400;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface TenantIdProps {
  value: string;
}

export class TenantId extends ValueObject<TenantIdProps> {
  get value(): string {
    return this.props.value;
  }

  static generate(): TenantId {
    return new TenantId({ value: randomUUID() });
  }

  static from(value: string): TenantId {
    if (!UUID_RE.test(value)) {
      throw new InvalidTenantIdError(`Invalid tenant id: ${value}`);
    }
    return new TenantId({ value });
  }
}
