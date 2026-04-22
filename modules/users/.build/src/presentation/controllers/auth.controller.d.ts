import { LoginInput } from '../../application/dtos/user.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
export declare class AuthController {
    private readonly login;
    constructor(login: LoginUseCase);
    doLogin(input: LoginInput): Promise<import("../../application/dtos/user.dto").LoginOutput>;
}
//# sourceMappingURL=auth.controller.d.ts.map