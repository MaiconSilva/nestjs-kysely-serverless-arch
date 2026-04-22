/**
 * Base class for domain errors. Each subclass carries a stable machine code
 * and the HTTP status the presentation layer must translate it to.
 * The `DomainErrorFilter` in the presentation layer consumes these fields.
 */
export declare abstract class DomainError extends Error {
    abstract readonly code: string;
    abstract readonly httpStatus: number;
    constructor(message: string);
    toJSON(): {
        code: string;
        message: string;
    };
}
//# sourceMappingURL=domain-error.base.d.ts.map