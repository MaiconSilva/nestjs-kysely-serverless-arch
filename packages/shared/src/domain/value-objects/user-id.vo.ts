import { randomUUID } from 'crypto';
import { ValueObject } from '../value-object.base';
import { DomainError } from '../domain-error.base';

export class InvalidUserIdError extends DomainError {
  readonly code = 'INVALID_USER_ID';
  readonly httpStatus = 400;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface UserIdProps {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> {
  get value(): string {
    return this.props.value;
  }

  static generate(): UserId {
    return new UserId({ value: randomUUID() });
  }

  static from(value: string): UserId {
    if (!UUID_RE.test(value)) {
      throw new InvalidUserIdError(`Invalid user id: ${value}`);
    }
    return new UserId({ value });
  }
}
