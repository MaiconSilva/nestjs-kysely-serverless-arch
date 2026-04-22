import { type ActivityRepository } from '../../domain/repositories/activity.repository';
import { type UserLookup } from '../../domain/services/user-lookup';
import type { ActivityOutput, AssignActivityInput } from '../dtos/activity.dto';
export declare class AssignActivityUseCase {
    private readonly repo;
    private readonly userLookup;
    constructor(repo: ActivityRepository, userLookup: UserLookup);
    execute(tenantId: string, activityId: string, input: AssignActivityInput): Promise<ActivityOutput>;
}
//# sourceMappingURL=assign-activity.use-case.d.ts.map