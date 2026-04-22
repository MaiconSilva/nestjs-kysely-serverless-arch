import type { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findByIdInTenant(tenantId: string, id: string): Promise<User | null>;
  findByEmailInTenant(tenantId: string, email: string): Promise<User | null>;
  findByCognitoSub(sub: string): Promise<User | null>;
  listByTenant(tenantId: string): Promise<User[]>;
  save(user: User): Promise<void>;
}
