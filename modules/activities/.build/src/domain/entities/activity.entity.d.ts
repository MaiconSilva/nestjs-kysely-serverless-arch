import { TenantId, UserId } from '@todolist/shared';
import { ActivityId } from '../value-objects/activity-id.vo';
import { ActivityStatus, type StatusValue } from '../value-objects/activity-status.vo';
export interface CreateActivityProps {
    tenantId: string;
    title: string;
    description?: string | null;
    createdBy: string;
}
export interface ActivitySnapshot {
    id: string;
    tenantId: string;
    title: string;
    description: string | null;
    status: StatusValue;
    assigneeId: string | null;
    assignedAt: Date | null;
    completedAt: Date | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Activity {
    readonly id: ActivityId;
    readonly tenantId: TenantId;
    private _title;
    private _description;
    private _status;
    private _assigneeId;
    private _assignedAt;
    private _completedAt;
    readonly createdBy: UserId;
    readonly createdAt: Date;
    private _updatedAt;
    private constructor();
    static create(props: CreateActivityProps): Activity;
    static restore(snap: ActivitySnapshot): Activity;
    get title(): string;
    get description(): string | null;
    get status(): ActivityStatus;
    get assigneeId(): UserId | null;
    get assignedAt(): Date | null;
    get completedAt(): Date | null;
    get updatedAt(): Date;
    /**
     * Assigns the activity to a user of the same tenant. Fails if the activity
     * already has another assignee (one-shot assignment per activity in this POC;
     * re-assignment is a future feature).
     */
    assign(userId: string, userTenantId: string): void;
    /**
     * Completes the activity. Requires an assignee and rejects double-completion.
     */
    complete(): void;
    private touch;
    toSnapshot(): ActivitySnapshot;
}
//# sourceMappingURL=activity.entity.d.ts.map