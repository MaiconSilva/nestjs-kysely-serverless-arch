import { DomainError } from '@todolist/shared';
export declare class TenantNotFoundError extends DomainError {
    readonly code = "TENANT_NOT_FOUND";
    readonly httpStatus = 404;
    constructor(id: string);
}
export declare class TenantSlugAlreadyExistsError extends DomainError {
    readonly code = "TENANT_SLUG_ALREADY_EXISTS";
    readonly httpStatus = 409;
    constructor(slug: string);
}
export declare class TenantInactiveError extends DomainError {
    readonly code = "TENANT_INACTIVE";
    readonly httpStatus = 403;
    constructor(id: string);
}
//# sourceMappingURL=tenant.errors.d.ts.map