import { type ActivityRepository } from '../../domain/repositories/activity.repository';
import type { ActivityOutput, ListActivitiesQuery } from '../dtos/activity.dto';
export declare class ListActivitiesUseCase {
    private readonly repo;
    constructor(repo: ActivityRepository);
    execute(tenantId: string, query?: ListActivitiesQuery): Promise<ActivityOutput[]>;
}
//# sourceMappingURL=list-activities.use-case.d.ts.map