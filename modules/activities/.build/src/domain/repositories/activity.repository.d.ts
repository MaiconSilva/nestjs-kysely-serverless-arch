import type { Activity } from '../entities/activity.entity';
export declare const ACTIVITY_REPOSITORY: unique symbol;
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
//# sourceMappingURL=activity.repository.d.ts.map