import { DomainError } from '@todolist/shared';
export declare class ActivityNotFoundError extends DomainError {
    readonly code = "ACTIVITY_NOT_FOUND";
    readonly httpStatus = 404;
    constructor(id: string);
}
export declare class InvalidActivityTitleError extends DomainError {
    readonly code = "INVALID_ACTIVITY_TITLE";
    readonly httpStatus = 400;
}
export declare class ActivityAlreadyAssignedError extends DomainError {
    readonly code = "ACTIVITY_ALREADY_ASSIGNED";
    readonly httpStatus = 409;
    constructor(id: string);
}
export declare class UserAlreadyHasActivityError extends DomainError {
    readonly code = "USER_ALREADY_HAS_ACTIVITY";
    readonly httpStatus = 409;
    constructor(userId: string);
}
export declare class ActivityHasNoAssigneeError extends DomainError {
    readonly code = "ACTIVITY_HAS_NO_ASSIGNEE";
    readonly httpStatus = 422;
    constructor(id: string);
}
export declare class ActivityAlreadyCompletedError extends DomainError {
    readonly code = "ACTIVITY_ALREADY_COMPLETED";
    readonly httpStatus = 409;
    constructor(id: string);
}
export declare class UserNotBelongsToTenantError extends DomainError {
    readonly code = "USER_NOT_BELONGS_TO_TENANT";
    readonly httpStatus = 403;
    constructor();
}
//# sourceMappingURL=activity.errors.d.ts.map