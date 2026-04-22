import { DomainError, ValueObject } from '@todolist/shared';
export declare class InvalidActivityIdError extends DomainError {
    readonly code = "INVALID_ACTIVITY_ID";
    readonly httpStatus = 400;
}
interface Props {
    value: string;
}
export declare class ActivityId extends ValueObject<Props> {
    get value(): string;
    static generate(): ActivityId;
    static from(value: string): ActivityId;
}
export {};
//# sourceMappingURL=activity-id.vo.d.ts.map