import { DomainError, ValueObject } from '@todolist/shared';

export class InvalidSlugError extends DomainError {
  readonly code = 'INVALID_SLUG';
  readonly httpStatus = 400;
}

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/;

interface SlugProps {
  value: string;
}

export class Slug extends ValueObject<SlugProps> {
  get value(): string {
    return this.props.value;
  }

  static from(raw: string): Slug {
    const normalized = raw.trim().toLowerCase();
    if (!SLUG_RE.test(normalized)) {
      throw new InvalidSlugError(
        `Invalid slug '${raw}' — must be lowercase alphanumeric with optional dashes, 1-100 chars`,
      );
    }
    return new Slug({ value: normalized });
  }
}
