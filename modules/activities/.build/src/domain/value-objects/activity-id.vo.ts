import { randomUUID } from 'crypto';
import { DomainError, ValueObject } from '@todolist/shared';

export class InvalidActivityIdError extends DomainError {
  readonly code = 'INVALID_ACTIVITY_ID';
  readonly httpStatus = 400;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface Props {
  value: string;
}

export class ActivityId extends ValueObject<Props> {
  get value(): string {
    return this.props.value;
  }

  static generate(): ActivityId {
    return new ActivityId({ value: randomUUID() });
  }

  static from(value: string): ActivityId {
    if (!UUID_RE.test(value)) throw new InvalidActivityIdError(`Invalid activity id: ${value}`);
    return new ActivityId({ value });
  }
}
