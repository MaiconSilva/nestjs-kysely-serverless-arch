import { DomainError } from '@todolist/shared';

export class ActivityNotFoundError extends DomainError {
  readonly code = 'ACTIVITY_NOT_FOUND';
  readonly httpStatus = 404;
  constructor(id: string) {
    super(`Activity not found: ${id}`);
  }
}

export class InvalidActivityTitleError extends DomainError {
  readonly code = 'INVALID_ACTIVITY_TITLE';
  readonly httpStatus = 400;
}

export class ActivityAlreadyAssignedError extends DomainError {
  readonly code = 'ACTIVITY_ALREADY_ASSIGNED';
  readonly httpStatus = 409;
  constructor(id: string) {
    super(`Activity ${id} already has an assignee`);
  }
}

export class UserAlreadyHasActivityError extends DomainError {
  readonly code = 'USER_ALREADY_HAS_ACTIVITY';
  readonly httpStatus = 409;
  constructor(userId: string) {
    super(`User ${userId} already has an active activity assigned`);
  }
}

export class ActivityHasNoAssigneeError extends DomainError {
  readonly code = 'ACTIVITY_HAS_NO_ASSIGNEE';
  readonly httpStatus = 422;
  constructor(id: string) {
    super(`Activity ${id} cannot be completed without an assignee`);
  }
}

export class ActivityAlreadyCompletedError extends DomainError {
  readonly code = 'ACTIVITY_ALREADY_COMPLETED';
  readonly httpStatus = 409;
  constructor(id: string) {
    super(`Activity ${id} is already completed`);
  }
}

export class UserNotBelongsToTenantError extends DomainError {
  readonly code = 'USER_NOT_BELONGS_TO_TENANT';
  readonly httpStatus = 403;
  constructor() {
    super('User does not belong to the activity tenant');
  }
}
