import { Inject, Injectable } from '@nestjs/common';
import {
  ACTIVITY_REPOSITORY,
  type ActivityRepository,
} from '../../domain/repositories/activity.repository';
import type { ActivityOutput, ListActivitiesQuery } from '../dtos/activity.dto';
import { toOutput } from './to-output';

@Injectable()
export class ListActivitiesUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY) private readonly repo: ActivityRepository,
  ) {}

  async execute(tenantId: string, query: ListActivitiesQuery = {}): Promise<ActivityOutput[]> {
    const list = await this.repo.listByTenant(tenantId, {
      status: query.status,
      assigneeId: query.assigneeId,
    });
    return list.map(toOutput);
  }
}
