"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainError = void 0;
/**
 * Base class for domain errors. Each subclass carries a stable machine code
 * and the HTTP status the presentation layer must translate it to.
 * The `DomainErrorFilter` in the presentation layer consumes these fields.
 */
class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    toJSON() {
        return { code: this.code, message: this.message };
    }
}
exports.DomainError = DomainError;
//# sourceMappingURL=domain-error.base.js.map