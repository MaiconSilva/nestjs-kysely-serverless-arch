import { Kysely } from 'kysely';
import { type DB } from '@todolist/shared';
import type { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
export declare class UserKyselyRepository implements UserRepository {
    private readonly db;
    constructor(db: Kysely<DB>);
    findByIdInTenant(tenantId: string, id: string): Promise<User | null>;
    findByEmailInTenant(tenantId: string, email: string): Promise<User | null>;
    /**
     * Login path: the tenant context must have been set by the caller before
     * invoking this method (see `LoginUseCase`, which sets it from the verified
     * JWT). Used by `@todolist/activities` and internal code paths that already
     * know the tenant.
     */
    findByCognitoSub(sub: string): Promise<User | null>;
    listByTenant(tenantId: string): Promise<User[]>;
    save(user: User): Promise<void>;
}
//# sourceMappingURL=user.kysely.repository.d.ts.map