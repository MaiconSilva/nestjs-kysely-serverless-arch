import { ValueObject } from '../value-object.base';
import { DomainError } from '../domain-error.base';
export declare class InvalidUserIdError extends DomainError {
    readonly code = "INVALID_USER_ID";
    readonly httpStatus = 400;
}
interface UserIdProps {
    value: string;
}
export declare class UserId extends ValueObject<UserIdProps> {
    get value(): string;
    static generate(): UserId;
    static from(value: string): UserId;
}
export {};
//# sourceMappingURL=user-id.vo.d.ts.map