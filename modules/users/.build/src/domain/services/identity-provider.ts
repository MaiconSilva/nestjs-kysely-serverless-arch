export const IDENTITY_PROVIDER = Symbol('IDENTITY_PROVIDER');

export interface CreateIdentityParams {
  email: string;
  temporaryPassword: string;
  tenantId: string;
  role: 'admin' | 'member';
  name: string;
}

export interface CreateIdentityResult {
  sub: string;
}

export interface AuthenticateParams {
  email: string;
  password: string;
}

export interface AuthenticateResult {
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  sub: string;
  tenantId: string;
  role: 'admin' | 'member';
  expiresIn: number;
}

/**
 * Abstracts Cognito so the domain doesn't import AWS SDK symbols directly.
 * The concrete implementation (`CognitoUserService`) lives in infrastructure.
 */
export interface IdentityProvider {
  createUser(params: CreateIdentityParams): Promise<CreateIdentityResult>;
  authenticate(params: AuthenticateParams): Promise<AuthenticateResult>;
}
