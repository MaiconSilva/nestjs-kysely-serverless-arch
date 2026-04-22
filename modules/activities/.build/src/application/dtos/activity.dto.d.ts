export declare class CreateActivityInput {
    title: string;
    description?: string;
}
export declare class AssignActivityInput {
    userId: string;
}
export declare class ListActivitiesQuery {
    status?: 'pending' | 'assigned' | 'completed';
    assigneeId?: string;
}
export interface ActivityOutput {
    id: string;
    tenantId: string;
    title: string;
    description: string | null;
    status: 'pending' | 'assigned' | 'completed';
    assigneeId: string | null;
    assignedAt: string | null;
    completedAt: string | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=activity.dto.d.ts.map