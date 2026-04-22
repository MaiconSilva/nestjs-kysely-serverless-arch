import { type ActivityRepository } from '../../domain/repositories/activity.repository';
import { type UserLookup } from '../../domain/services/user-lookup';
import type { CreateActivityInput, ActivityOutput } from '../dtos/activity.dto';
export declare class CreateActivityUseCase {
    private readonly repo;
    private readonly users;
    constructor(repo: ActivityRepository, users: UserLookup);
    execute(tenantId: string, creatorSub: string, input: CreateActivityInput): Promise<ActivityOutput>;
}
//# sourceMappingURL=create-activity.use-case.d.ts.map