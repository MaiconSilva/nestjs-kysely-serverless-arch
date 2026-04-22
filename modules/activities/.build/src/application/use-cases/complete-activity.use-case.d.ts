import { type ActivityRepository } from '../../domain/repositories/activity.repository';
import type { ActivityOutput } from '../dtos/activity.dto';
export declare class CompleteActivityUseCase {
    private readonly repo;
    constructor(repo: ActivityRepository);
    execute(tenantId: string, activityId: string): Promise<ActivityOutput>;
}
//# sourceMappingURL=complete-activity.use-case.d.ts.map