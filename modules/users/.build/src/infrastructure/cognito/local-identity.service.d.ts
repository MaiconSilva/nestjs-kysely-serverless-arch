import type { AuthenticateParams, AuthenticateResult, CreateIdentityParams, CreateIdentityResult, IdentityProvider } from '../../domain/services/identity-provider';
/**
 * Development-only identity provider. Persists a JSON file so that
 * `serverless offline` restarts and separate module processes share the same
 * identity database. Enable by setting AUTH_MODE=local.
 *
 * NEVER ship to production. The token is signed with an HS256 shared secret.
 */
export declare class LocalIdentityService implements IdentityProvider {
    private readonly filePath;
    private readonly secret;
    createUser(params: CreateIdentityParams): Promise<CreateIdentityResult>;
    authenticate(params: AuthenticateParams): Promise<AuthenticateResult>;
    private load;
    private save;
}
//# sourceMappingURL=local-identity.service.d.ts.map