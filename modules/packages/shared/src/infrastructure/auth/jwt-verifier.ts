import { CognitoJwtVerifier } from 'aws-jwt-verify';
import jwt from 'jsonwebtoken';

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
export class CognitoJwtVerifierImpl implements JwtVerifier {
  private readonly verifier;

  constructor(params: { userPoolId: string; clientId: string; tokenUse?: 'access' | 'id' }) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: params.userPoolId,
      tokenUse: params.tokenUse ?? 'access',
      clientId: params.clientId,
    });
  }

  async verify(token: string): Promise<AuthenticatedClaims> {
    const payload = await this.verifier.verify(token);
    const tenantId = (payload as Record<string, unknown>)['custom:tenant_id'];
    const role = (payload as Record<string, unknown>)['custom:role'];
    if (typeof tenantId !== 'string') throw new Error('Missing custom:tenant_id claim');
    if (role !== 'admin' && role !== 'member') throw new Error('Invalid custom:role claim');
    return {
      sub: payload.sub as string,
      tenantId,
      role,
      email: (payload as Record<string, unknown>).email as string | undefined,
    };
  }
}

/**
 * Local HS256 verifier. Used on `serverless offline` and integration tests so
 * we don't need a real AWS Cognito pool running to exercise the auth path.
 * Enable it by setting AUTH_MODE=local and JWT_LOCAL_SECRET.
 */
export class LocalHsJwtVerifier implements JwtVerifier {
  constructor(private readonly secret: string) {}

  async verify(token: string): Promise<AuthenticatedClaims> {
    const payload = jwt.verify(token, this.secret) as jwt.JwtPayload;
    const tenantId = payload['custom:tenant_id'] ?? payload.tenantId;
    const role = payload['custom:role'] ?? payload.role;
    if (typeof tenantId !== 'string') throw new Error('Missing tenantId claim');
    if (role !== 'admin' && role !== 'member') throw new Error('Invalid role claim');
    if (typeof payload.sub !== 'string') throw new Error('Missing sub claim');
    return {
      sub: payload.sub,
      tenantId,
      role,
      email: payload.email as string | undefined,
    };
  }

  sign(claims: AuthenticatedClaims, ttlSeconds = 3600): string {
    return jwt.sign(
      {
        sub: claims.sub,
        'custom:tenant_id': claims.tenantId,
        'custom:role': claims.role,
        email: claims.email,
      },
      this.secret,
      { expiresIn: ttlSeconds },
    );
  }
}

let verifierInstance: JwtVerifier | null = null;

export function getJwtVerifier(): JwtVerifier {
  if (verifierInstance) return verifierInstance;
  const mode = process.env.AUTH_MODE ?? (process.env.COGNITO_USER_POOL_ID ? 'cognito' : 'local');
  if (mode === 'cognito') {
    verifierInstance = new CognitoJwtVerifierImpl({
      userPoolId: required('COGNITO_USER_POOL_ID'),
      clientId: required('COGNITO_CLIENT_ID'),
      tokenUse: (process.env.COGNITO_TOKEN_USE as 'access' | 'id' | undefined) ?? 'access',
    });
  } else {
    verifierInstance = new LocalHsJwtVerifier(required('JWT_LOCAL_SECRET'));
  }
  return verifierInstance;
}

export function resetJwtVerifier(): void {
  verifierInstance = null;
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}
