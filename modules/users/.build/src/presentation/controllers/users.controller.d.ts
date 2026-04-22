import { CreateUserInput } from '../../application/dtos/user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
export declare class UsersController {
    private readonly createUser;
    private readonly listUsers;
    constructor(createUser: CreateUserUseCase, listUsers: ListUsersUseCase);
    create(tenantId: string, input: CreateUserInput): Promise<import("../../application/dtos/user.dto").UserOutput>;
    list(tenantId: string): Promise<import("../../application/dtos/user.dto").UserOutput[]>;
}
//# sourceMappingURL=users.controller.d.ts.map