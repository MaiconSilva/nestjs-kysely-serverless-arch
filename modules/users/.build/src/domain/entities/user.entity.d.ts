import { Email, TenantId, UserId } from '@todolist/shared';
import { Role, type RoleValue } from '../value-objects/role.vo';
interface UserSnapshot {
    id: string;
    tenantId: string;
    name: string;
    email: string;
    role: RoleValue;
    cognitoSub: string | null;
    active: boolean;
    createdAt: Date;
}
export declare class User {
    readonly id: UserId;
    readonly tenantId: TenantId;
    private _name;
    readonly email: Email;
    private _role;
    private _cognitoSub;
    private _active;
    readonly createdAt: Date;
    private constructor();
    static create(props: {
        tenantId: string;
        name: string;
        email: string;
        role?: RoleValue;
        cognitoSub?: string | null;
    }): User;
    static restore(snapshot: UserSnapshot): User;
    get name(): string;
    get role(): Role;
    get cognitoSub(): string | null;
    get active(): boolean;
    linkCognitoSub(sub: string): void;
    deactivate(): void;
    promoteToAdmin(): void;
    toSnapshot(): UserSnapshot;
}
export {};
//# sourceMappingURL=user.entity.d.ts.map