/**
 * Base class for domain errors. Each subclass carries a stable machine code
 * and the HTTP status the presentation layer must translate it to.
 * The `DomainErrorFilter` in the presentation layer consumes these fields.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON(): { code: string; message: string } {
    return { code: this.code, message: this.message };
  }
}
