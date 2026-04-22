import type { User } from '../entities/user.entity';
export declare const USER_REPOSITORY: unique symbol;
export interface UserRepository {
    findByIdInTenant(tenantId: string, id: string): Promise<User | null>;
    findByEmailInTenant(tenantId: string, email: string): Promise<User | null>;
    findByCognitoSub(sub: string): Promise<User | null>;
    listByTenant(tenantId: string): Promise<User[]>;
    save(user: User): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map