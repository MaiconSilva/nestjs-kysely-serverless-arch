import { type UserRepository } from '../../domain/repositories/user.repository';
import { type IdentityProvider } from '../../domain/services/identity-provider';
import type { CreateUserInput, UserOutput } from '../dtos/user.dto';
export declare class CreateUserUseCase {
    private readonly users;
    private readonly identity;
    constructor(users: UserRepository, identity: IdentityProvider);
    execute(tenantId: string, input: CreateUserInput): Promise<UserOutput>;
}
//# sourceMappingURL=create-user.use-case.d.ts.map