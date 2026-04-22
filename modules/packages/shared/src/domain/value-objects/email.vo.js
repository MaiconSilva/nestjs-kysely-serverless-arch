"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = exports.InvalidEmailError = void 0;
const value_object_base_1 = require("../value-object.base");
const domain_error_base_1 = require("../domain-error.base");
class InvalidEmailError extends domain_error_base_1.DomainError {
    code = 'INVALID_EMAIL';
    httpStatus = 400;
}
exports.InvalidEmailError = InvalidEmailError;
// Simplified RFC 5322: sufficient for the POC, not a full validator.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
class Email extends value_object_base_1.ValueObject {
    get value() {
        return this.props.value;
    }
    static from(raw) {
        const normalized = raw.trim().toLowerCase();
        if (normalized.length > 255 || !EMAIL_RE.test(normalized)) {
            throw new InvalidEmailError(`Invalid email: ${raw}`);
        }
        return new Email({ value: normalized });
    }
}
exports.Email = Email;
//# sourceMappingURL=email.vo.js.map