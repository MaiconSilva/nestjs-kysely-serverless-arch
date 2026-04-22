import { Kysely } from 'kysely';
import { type DB } from '@todolist/shared';
import type { Activity } from '../../domain/entities/activity.entity';
import type { ActivityListFilter, ActivityRepository } from '../../domain/repositories/activity.repository';
export declare class ActivityKyselyRepository implements ActivityRepository {
    private readonly db;
    constructor(db: Kysely<DB>);
    findById(tenantId: string, id: string): Promise<Activity | null>;
    listByTenant(tenantId: string, filter?: ActivityListFilter): Promise<Activity[]>;
    /**
     * Finds the (at most one) active activity a user currently holds. Used by
     * `AssignActivityUseCase` to enforce "one activity per user". The partial
     * unique index `idx_activities_one_active_per_user` in the schema is the
     * database-level safety net.
     */
    findActiveByAssignee(tenantId: string, userId: string): Promise<Activity | null>;
    save(activity: Activity): Promise<void>;
}
//# sourceMappingURL=activity.kysely.repository.d.ts.map