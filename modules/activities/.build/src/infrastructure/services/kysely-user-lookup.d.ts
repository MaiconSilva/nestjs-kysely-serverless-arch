import { Kysely } from 'kysely';
import { type DB } from '@todolist/shared';
import type { UserLookup } from '../../domain/services/user-lookup';
export declare class KyselyUserLookup implements UserLookup {
    private readonly db;
    constructor(db: Kysely<DB>);
    findTenantOfUser(tenantId: string, userId: string): Promise<string | null>;
    findUserIdBySub(tenantId: string, sub: string): Promise<string | null>;
}
//# sourceMappingURL=kysely-user-lookup.d.ts.map