import { Inject, Injectable } from '@nestjs/common';
import {
  ActivityNotFoundError,
  UserAlreadyHasActivityError,
  UserNotBelongsToTenantError,
} from '../../domain/errors/activity.errors';
import {
  ACTIVITY_REPOSITORY,
  type ActivityRepository,
} from '../../domain/repositories/activity.repository';
import { USER_LOOKUP, type UserLookup } from '../../domain/services/user-lookup';
import type { ActivityOutput, AssignActivityInput } from '../dtos/activity.dto';
import { toOutput } from './to-output';

@Injectable()
export class AssignActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY) private readonly repo: ActivityRepository,
    @Inject(USER_LOOKUP) private readonly userLookup: UserLookup,
  ) {}

  async execute(
    tenantId: string,
    activityId: string,
    input: AssignActivityInput,
  ): Promise<ActivityOutput> {
    const activity = await this.repo.findById(tenantId, activityId);
    if (!activity) throw new ActivityNotFoundError(activityId);

    const userTenant = await this.userLookup.findTenantOfUser(tenantId, input.userId);
    if (!userTenant) throw new UserNotBelongsToTenantError();

    // Enforce at the application layer: one active activity per user.
    // The DB also has a partial unique index as a last-mile guarantee.
    const existing = await this.repo.findActiveByAssignee(tenantId, input.userId);
    if (existing) throw new UserAlreadyHasActivityError(input.userId);

    activity.assign(input.userId, userTenant);
    await this.repo.save(activity);
    return toOutput(activity);
  }
}
