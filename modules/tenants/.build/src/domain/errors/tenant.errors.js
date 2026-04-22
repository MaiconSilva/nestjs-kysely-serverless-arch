"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantInactiveError = exports.TenantSlugAlreadyExistsError = exports.TenantNotFoundError = void 0;
const shared_1 = require("@todolist/shared");
class TenantNotFoundError extends shared_1.DomainError {
    code = 'TENANT_NOT_FOUND';
    httpStatus = 404;
    constructor(id) {
        super(`Tenant not found: ${id}`);
    }
}
exports.TenantNotFoundError = TenantNotFoundError;
class TenantSlugAlreadyExistsError extends shared_1.DomainError {
    code = 'TENANT_SLUG_ALREADY_EXISTS';
    httpStatus = 409;
    constructor(slug) {
        super(`Slug already in use: ${slug}`);
    }
}
exports.TenantSlugAlreadyExistsError = TenantSlugAlreadyExistsError;
class TenantInactiveError extends shared_1.DomainError {
    code = 'TENANT_INACTIVE';
    httpStatus = 403;
    constructor(id) {
        super(`Tenant is inactive: ${id}`);
    }
}
exports.TenantInactiveError = TenantInactiveError;
//# sourceMappingURL=tenant.errors.js.map