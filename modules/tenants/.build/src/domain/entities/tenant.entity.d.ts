import { TenantId } from '@todolist/shared';
import { Slug } from '../value-objects/slug.vo';
interface TenantSnapshot {
    id: string;
    name: string;
    slug: string;
    active: boolean;
    createdAt: Date;
}
export declare class Tenant {
    readonly id: TenantId;
    private _name;
    readonly slug: Slug;
    private _active;
    readonly createdAt: Date;
    private constructor();
    static create(props: {
        name: string;
        slug: string;
    }): Tenant;
    static restore(snapshot: TenantSnapshot): Tenant;
    get name(): string;
    get active(): boolean;
    deactivate(): void;
    reactivate(): void;
    toSnapshot(): TenantSnapshot;
}
export {};
//# sourceMappingURL=tenant.entity.d.ts.map