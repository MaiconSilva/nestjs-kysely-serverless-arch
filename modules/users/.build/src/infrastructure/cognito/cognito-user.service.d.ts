import type { AuthenticateParams, AuthenticateResult, CreateIdentityParams, CreateIdentityResult, IdentityProvider } from '../../domain/services/identity-provider';
interface CognitoConfig {
    userPoolId: string;
    clientId: string;
    region?: string;
    endpoint?: string;
}
export declare class CognitoUserService implements IdentityProvider {
    private readonly logger;
    private readonly client;
    private readonly userPoolId;
    private readonly clientId;
    constructor(cfg?: CognitoConfig);
    createUser(params: CreateIdentityParams): Promise<CreateIdentityResult>;
    authenticate(params: AuthenticateParams): Promise<AuthenticateResult>;
    updateRole(sub: string, email: string, role: 'admin' | 'member'): Promise<void>;
}
export {};
//# sourceMappingURL=cognito-user.service.d.ts.map