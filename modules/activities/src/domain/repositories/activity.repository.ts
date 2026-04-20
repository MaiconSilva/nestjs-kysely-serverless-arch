import type { Activity } from '../entities/activity.entity';

export const ACTIVITY_REPOSITORY = Symbol('ACTIVITY_REPOSITORY');

export interface ActivityListFilter {
  status?: 'pending' | 'assigned' | 'completed';
  assigneeId?: string;
}

export interface ActivityRepository {
  findById(tenantId: string, id: string): Promise<Activity | null>;
  listByTenant(tenantId: string, filter?: ActivityListFilter): Promise<Activity[]>;
  findActiveByAssignee(tenantId: string, userId: string): Promise<Activity | null>;
  save(activity: Activity): Promise<void>;
}
