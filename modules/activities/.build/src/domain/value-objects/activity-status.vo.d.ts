import { DomainError, ValueObject } from '@todolist/shared';
export declare class InvalidActivityStatusError extends DomainError {
    readonly code = "INVALID_ACTIVITY_STATUS";
    readonly httpStatus = 400;
}
export type StatusValue = 'pending' | 'assigned' | 'completed';
interface Props {
    value: StatusValue;
}
export declare class ActivityStatus extends ValueObject<Props> {
    private static readonly PENDING;
    private static readonly ASSIGNED;
    private static readonly COMPLETED;
    get value(): StatusValue;
    static pending(): ActivityStatus;
    static assigned(): ActivityStatus;
    static completed(): ActivityStatus;
    static from(raw: string): ActivityStatus;
    isCompleted(): boolean;
    isPending(): boolean;
    isAssigned(): boolean;
}
export {};
//# sourceMappingURL=activity-status.vo.d.ts.map