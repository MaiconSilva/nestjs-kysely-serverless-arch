import { DomainError, ValueObject } from '@todolist/shared';
export declare class InvalidRoleError extends DomainError {
    readonly code = "INVALID_ROLE";
    readonly httpStatus = 400;
}
export type RoleValue = 'admin' | 'member';
interface RoleProps {
    value: RoleValue;
}
export declare class Role extends ValueObject<RoleProps> {
    static readonly ADMIN: Role;
    static readonly MEMBER: Role;
    get value(): RoleValue;
    isAdmin(): boolean;
    static from(raw: string): Role;
}
export {};
//# sourceMappingURL=role.vo.d.ts.map