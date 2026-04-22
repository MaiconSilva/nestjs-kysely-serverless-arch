"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotBelongsToTenantError = exports.ActivityAlreadyCompletedError = exports.ActivityHasNoAssigneeError = exports.UserAlreadyHasActivityError = exports.ActivityAlreadyAssignedError = exports.InvalidActivityTitleError = exports.ActivityNotFoundError = void 0;
const shared_1 = require("@todolist/shared");
class ActivityNotFoundError extends shared_1.DomainError {
    code = 'ACTIVITY_NOT_FOUND';
    httpStatus = 404;
    constructor(id) {
        super(`Activity not found: ${id}`);
    }
}
exports.ActivityNotFoundError = ActivityNotFoundError;
class InvalidActivityTitleError extends shared_1.DomainError {
    code = 'INVALID_ACTIVITY_TITLE';
    httpStatus = 400;
}
exports.InvalidActivityTitleError = InvalidActivityTitleError;
class ActivityAlreadyAssignedError extends shared_1.DomainError {
    code = 'ACTIVITY_ALREADY_ASSIGNED';
    httpStatus = 409;
    constructor(id) {
        super(`Activity ${id} already has an assignee`);
    }
}
exports.ActivityAlreadyAssignedError = ActivityAlreadyAssignedError;
class UserAlreadyHasActivityError extends shared_1.DomainError {
    code = 'USER_ALREADY_HAS_ACTIVITY';
    httpStatus = 409;
    constructor(userId) {
        super(`User ${userId} already has an active activity assigned`);
    }
}
exports.UserAlreadyHasActivityError = UserAlreadyHasActivityError;
class ActivityHasNoAssigneeError extends shared_1.DomainError {
    code = 'ACTIVITY_HAS_NO_ASSIGNEE';
    httpStatus = 422;
    constructor(id) {
        super(`Activity ${id} cannot be completed without an assignee`);
    }
}
exports.ActivityHasNoAssigneeError = ActivityHasNoAssigneeError;
class ActivityAlreadyCompletedError extends shared_1.DomainError {
    code = 'ACTIVITY_ALREADY_COMPLETED';
    httpStatus = 409;
    constructor(id) {
        super(`Activity ${id} is already completed`);
    }
}
exports.ActivityAlreadyCompletedError = ActivityAlreadyCompletedError;
class UserNotBelongsToTenantError extends shared_1.DomainError {
    code = 'USER_NOT_BELONGS_TO_TENANT';
    httpStatus = 403;
    constructor() {
        super('User does not belong to the activity tenant');
    }
}
exports.UserNotBelongsToTenantError = UserNotBelongsToTenantError;
//# sourceMappingURL=activity.errors.js.map