import { DomainError } from '@todolist/shared';
export declare class UserNotFoundError extends DomainError {
    readonly code = "USER_NOT_FOUND";
    readonly httpStatus = 404;
    constructor(idOrEmail: string);
}
export declare class EmailAlreadyExistsError extends DomainError {
    readonly code = "EMAIL_ALREADY_EXISTS";
    readonly httpStatus = 409;
    constructor(email: string);
}
export declare class InvalidCredentialsError extends DomainError {
    readonly code = "INVALID_CREDENTIALS";
    readonly httpStatus = 401;
    constructor();
}
export declare class UserNotBelongsToTenantError extends DomainError {
    readonly code = "USER_NOT_BELONGS_TO_TENANT";
    readonly httpStatus = 403;
    constructor();
}
export declare class TenantInactiveLoginError extends DomainError {
    readonly code = "TENANT_INACTIVE";
    readonly httpStatus = 403;
    constructor();
}
//# sourceMappingURL=user.errors.d.ts.map