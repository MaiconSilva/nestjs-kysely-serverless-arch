import { ValueObject } from '../value-object.base';
import { DomainError } from '../domain-error.base';
export declare class InvalidTenantIdError extends DomainError {
    readonly code = "INVALID_TENANT_ID";
    readonly httpStatus = 400;
}
interface TenantIdProps {
    value: string;
}
export declare class TenantId extends ValueObject<TenantIdProps> {
    get value(): string;
    static generate(): TenantId;
    static from(value: string): TenantId;
}
export {};
//# sourceMappingURL=tenant-id.vo.d.ts.map