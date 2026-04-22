import { ValueObject } from '../value-object.base';
import { DomainError } from '../domain-error.base';

export class InvalidEmailError extends DomainError {
  readonly code = 'INVALID_EMAIL';
  readonly httpStatus = 400;
}

// Simplified RFC 5322: sufficient for the POC, not a full validator.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value;
  }

  static from(raw: string): Email {
    const normalized = raw.trim().toLowerCase();
    if (normalized.length > 255 || !EMAIL_RE.test(normalized)) {
      throw new InvalidEmailError(`Invalid email: ${raw}`);
    }
    return new Email({ value: normalized });
  }
}
