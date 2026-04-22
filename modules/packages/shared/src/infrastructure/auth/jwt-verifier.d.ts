export interface AuthenticatedClaims {
    sub: string;
    tenantId: string;
    role: 'admin' | 'member';
    email?: string;
}
export interface JwtVerifier {
    verify(token: string): Promise<AuthenticatedClaims>;
}
/**
 * Cognito verifier — validates signature against the User Pool JWKS.
 * `aws-jwt-verify` caches the JWKS in memory so the remote fetch happens once
 * per cold start.
 */
export declare class CognitoJwtVerifierImpl implements JwtVerifier {
    private readonly verifier;
    constructor(params: {
        userPoolId: string;
        clientId: string;
        tokenUse?: 'access' | 'id';
    });
    verify(token: string): Promise<AuthenticatedClaims>;
}
/**
 * Local HS256 verifier. Used on `serverless offline` and integration tests so
 * we don't need a real AWS Cognito pool running to exercise the auth path.
 * Enable it by setting AUTH_MODE=local and JWT_LOCAL_SECRET.
 */
export declare class LocalHsJwtVerifier implements JwtVerifier {
    private readonly secret;
    constructor(secret: string);
    verify(token: string): Promise<AuthenticatedClaims>;
    sign(claims: AuthenticatedClaims, ttlSeconds?: number): string;
}
export declare function getJwtVerifier(): JwtVerifier;
export declare function resetJwtVerifier(): void;
//# sourceMappingURL=jwt-verifier.d.ts.map