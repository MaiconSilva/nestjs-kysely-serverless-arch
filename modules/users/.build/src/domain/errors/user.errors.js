"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantInactiveLoginError = exports.UserNotBelongsToTenantError = exports.InvalidCredentialsError = exports.EmailAlreadyExistsError = exports.UserNotFoundError = void 0;
const shared_1 = require("@todolist/shared");
class UserNotFoundError extends shared_1.DomainError {
    code = 'USER_NOT_FOUND';
    httpStatus = 404;
    constructor(idOrEmail) {
        super(`User not found: ${idOrEmail}`);
    }
}
exports.UserNotFoundError = UserNotFoundError;
class EmailAlreadyExistsError extends shared_1.DomainError {
    code = 'EMAIL_ALREADY_EXISTS';
    httpStatus = 409;
    constructor(email) {
        super(`Email already registered in this tenant: ${email}`);
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
class InvalidCredentialsError extends shared_1.DomainError {
    code = 'INVALID_CREDENTIALS';
    httpStatus = 401;
    constructor() {
        super('Invalid email or password');
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class UserNotBelongsToTenantError extends shared_1.DomainError {
    code = 'USER_NOT_BELONGS_TO_TENANT';
    httpStatus = 403;
    constructor() {
        super('User does not belong to the requested tenant');
    }
}
exports.UserNotBelongsToTenantError = UserNotBelongsToTenantError;
class TenantInactiveLoginError extends shared_1.DomainError {
    code = 'TENANT_INACTIVE';
    httpStatus = 403;
    constructor() {
        super('Tenant is inactive — login blocked');
    }
}
exports.TenantInactiveLoginError = TenantInactiveLoginError;
//# sourceMappingURL=user.errors.js.map