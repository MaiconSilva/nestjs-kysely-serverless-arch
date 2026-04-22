import { type UserRepository } from '../../domain/repositories/user.repository';
import type { UserOutput } from '../dtos/user.dto';
export declare class ListUsersUseCase {
    private readonly users;
    constructor(users: UserRepository);
    execute(tenantId: string): Promise<UserOutput[]>;
}
//# sourceMappingURL=list-users.use-case.d.ts.map