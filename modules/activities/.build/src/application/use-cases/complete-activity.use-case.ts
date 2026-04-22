import { Inject, Injectable } from '@nestjs/common';
import { ActivityNotFoundError } from '../../domain/errors/activity.errors';
import {
  ACTIVITY_REPOSITORY,
  type ActivityRepository,
} from '../../domain/repositories/activity.repository';
import type { ActivityOutput } from '../dtos/activity.dto';
import { toOutput } from './to-output';

@Injectable()
export class CompleteActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY) private readonly repo: ActivityRepository,
  ) {}

  async execute(tenantId: string, activityId: string): Promise<ActivityOutput> {
    const activity = await this.repo.findById(tenantId, activityId);
    if (!activity) throw new ActivityNotFoundError(activityId);
    activity.complete();
    await this.repo.save(activity);
    return toOutput(activity);
  }
}
