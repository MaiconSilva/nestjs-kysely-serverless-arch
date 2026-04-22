import { AssignActivityInput, CreateActivityInput, ListActivitiesQuery } from '../../application/dtos/activity.dto';
import { AssignActivityUseCase } from '../../application/use-cases/assign-activity.use-case';
import { CompleteActivityUseCase } from '../../application/use-cases/complete-activity.use-case';
import { CreateActivityUseCase } from '../../application/use-cases/create-activity.use-case';
import { ListActivitiesUseCase } from '../../application/use-cases/list-activities.use-case';
export declare class ActivitiesController {
    private readonly createActivity;
    private readonly listActivities;
    private readonly assignActivity;
    private readonly completeActivity;
    constructor(createActivity: CreateActivityUseCase, listActivities: ListActivitiesUseCase, assignActivity: AssignActivityUseCase, completeActivity: CompleteActivityUseCase);
    create(tenantId: string, userSub: string, input: CreateActivityInput): Promise<import("../../application/dtos/activity.dto").ActivityOutput>;
    list(tenantId: string, query: ListActivitiesQuery): Promise<import("../../application/dtos/activity.dto").ActivityOutput[]>;
    assign(tenantId: string, id: string, input: AssignActivityInput): Promise<import("../../application/dtos/activity.dto").ActivityOutput>;
    complete(tenantId: string, id: string): Promise<import("../../application/dtos/activity.dto").ActivityOutput>;
}
//# sourceMappingURL=activities.controller.d.ts.map