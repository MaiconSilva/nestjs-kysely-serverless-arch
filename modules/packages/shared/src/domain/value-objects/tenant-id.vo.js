"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantId = exports.InvalidTenantIdError = void 0;
const crypto_1 = require("crypto");
const value_object_base_1 = require("../value-object.base");
const domain_error_base_1 = require("../domain-error.base");
class InvalidTenantIdError extends domain_error_base_1.DomainError {
    code = 'INVALID_TENANT_ID';
    httpStatus = 400;
}
exports.InvalidTenantIdError = InvalidTenantIdError;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
class TenantId extends value_object_base_1.ValueObject {
    get value() {
        return this.props.value;
    }
    static generate() {
        return new TenantId({ value: (0, crypto_1.randomUUID)() });
    }
    static from(value) {
        if (!UUID_RE.test(value)) {
            throw new InvalidTenantIdError(`Invalid tenant id: ${value}`);
        }
        return new TenantId({ value });
    }
}
exports.TenantId = TenantId;
//# sourceMappingURL=tenant-id.vo.js.map