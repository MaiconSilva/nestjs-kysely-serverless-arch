"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserId = exports.InvalidUserIdError = void 0;
const crypto_1 = require("crypto");
const value_object_base_1 = require("../value-object.base");
const domain_error_base_1 = require("../domain-error.base");
class InvalidUserIdError extends domain_error_base_1.DomainError {
    code = 'INVALID_USER_ID';
    httpStatus = 400;
}
exports.InvalidUserIdError = InvalidUserIdError;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
class UserId extends value_object_base_1.ValueObject {
    get value() {
        return this.props.value;
    }
    static generate() {
        return new UserId({ value: (0, crypto_1.randomUUID)() });
    }
    static from(value) {
        if (!UUID_RE.test(value)) {
            throw new InvalidUserIdError(`Invalid user id: ${value}`);
        }
        return new UserId({ value });
    }
}
exports.UserId = UserId;
//# sourceMappingURL=user-id.vo.js.map