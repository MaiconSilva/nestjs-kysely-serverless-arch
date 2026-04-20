import { Inject, Injectable } from '@nestjs/common';
import { Activity } from '../../domain/entities/activity.entity';
import {
  ACTIVITY_REPOSITORY,
  type ActivityRepository,
} from '../../domain/repositories/activity.repository';
import { USER_LOOKUP, type UserLookup } from '../../domain/services/user-lookup';
import { UserNotBelongsToTenantError } from '../../domain/errors/activity.errors';
import type { CreateActivityInput, ActivityOutput } from '../dtos/activity.dto';
import { toOutput } from './to-output';

@Injectable()
export class CreateActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY) private readonly repo: ActivityRepository,
    @Inject(USER_LOOKUP) private readonly users: UserLookup,
  ) {}

  async execute(
    tenantId: string,
    creatorSub: string,
    input: CreateActivityInput,
  ): Promise<ActivityOutput> {
    const creatorUserId = await this.users.findUserIdBySub(tenantId, creatorSub);
    if (!creatorUserId) throw new UserNotBelongsToTenantError();

    const activity = Activity.create({
      tenantId,
      title: input.title,
      description: input.description,
      createdBy: creatorUserId,
    });
    await this.repo.save(activity);
    return toOutput(activity);
  }
}
