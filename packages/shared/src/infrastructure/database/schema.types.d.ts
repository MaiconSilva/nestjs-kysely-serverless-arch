import type { ColumnType, Generated } from 'kysely';
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export interface TenantsTable {
    id: Generated<string>;
    name: string;
    slug: string;
    active: Generated<boolean>;
    created_at: Generated<Timestamp>;
}
export interface UsersTable {
    id: Generated<string>;
    tenant_id: string;
    name: string;
    email: string;
    role: Generated<'admin' | 'member'>;
    cognito_sub: string | null;
    active: Generated<boolean>;
    created_at: Generated<Timestamp>;
}
export interface ActivitiesTable {
    id: Generated<string>;
    tenant_id: string;
    title: string;
    description: string | null;
    status: Generated<'pending' | 'assigned' | 'completed'>;
    assignee_id: string | null;
    assigned_at: Timestamp | null;
    completed_at: Timestamp | null;
    created_by: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
}
export interface DB {
    tenants: TenantsTable;
    users: UsersTable;
    activities: ActivitiesTable;
}
//# sourceMappingURL=schema.types.d.ts.map