import { Injectable, Logger } from '@nestjs/common';
import {
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import type {
  AuthenticateParams,
  AuthenticateResult,
  CreateIdentityParams,
  CreateIdentityResult,
  IdentityProvider,
} from '../../domain/services/identity-provider';

interface CognitoConfig {
  userPoolId: string;
  clientId: string;
  region?: string;
  endpoint?: string; // LocalStack override
}

@Injectable()
export class CognitoUserService implements IdentityProvider {
  private readonly logger = new Logger(CognitoUserService.name);
  private readonly client: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;

  constructor(cfg?: CognitoConfig) {
    const region = cfg?.region ?? process.env.AWS_REGION ?? 'us-east-1';
    const endpoint = cfg?.endpoint ?? process.env.COGNITO_ENDPOINT;
    this.userPoolId = cfg?.userPoolId ?? required('COGNITO_USER_POOL_ID');
    this.clientId = cfg?.clientId ?? required('COGNITO_CLIENT_ID');
    this.client = new CognitoIdentityProviderClient({
      region,
      ...(endpoint ? { endpoint } : {}),
    });
  }

  async createUser(params: CreateIdentityParams): Promise<CreateIdentityResult> {
    const createRes = await this.client.send(
      new AdminCreateUserCommand({
        UserPoolId: this.userPoolId,
        Username: params.email,
        MessageAction: 'SUPPRESS',
        TemporaryPassword: params.temporaryPassword,
        UserAttributes: [
          { Name: 'email', Value: params.email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'name', Value: params.name },
          { Name: 'custom:tenant_id', Value: params.tenantId },
          { Name: 'custom:role', Value: params.role },
        ],
      }),
    );

    // Set the password as permanent so the user doesn't have to go through
    // NEW_PASSWORD_REQUIRED on first login — this POC trades convenience for
    // production-grade flow.
    await this.client.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId,
        Username: params.email,
        Password: params.temporaryPassword,
        Permanent: true,
      }),
    );

    const sub =
      createRes.User?.Attributes?.find((a) => a.Name === 'sub')?.Value ?? null;
    if (!sub) throw new Error('Cognito AdminCreateUser did not return sub');
    return { sub };
  }

  async authenticate(params: AuthenticateParams): Promise<AuthenticateResult> {
    const res = await this.client.send(
      new AdminInitiateAuthCommand({
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: params.email,
          PASSWORD: params.password,
        },
      }),
    );
    const auth = res.AuthenticationResult;
    if (!auth?.AccessToken || !auth?.IdToken) {
      throw new Error('Cognito authentication did not return tokens');
    }
    const decoded = decodeJwtPayload(auth.IdToken);
    const sub = decoded.sub as string | undefined;
    const tenantId = decoded['custom:tenant_id'] as string | undefined;
    const role = decoded['custom:role'] as 'admin' | 'member' | undefined;
    if (!sub || !tenantId || (role !== 'admin' && role !== 'member')) {
      throw new Error('Cognito token is missing required claims');
    }
    return {
      accessToken: auth.AccessToken,
      idToken: auth.IdToken,
      refreshToken: auth.RefreshToken,
      expiresIn: auth.ExpiresIn ?? 3600,
      sub,
      tenantId,
      role,
    };
  }

  async updateRole(sub: string, email: string, role: 'admin' | 'member'): Promise<void> {
    await this.client.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: this.userPoolId,
        Username: email,
        UserAttributes: [{ Name: 'custom:role', Value: role }],
      }),
    );
    this.logger.log(`Updated Cognito role of ${sub} to ${role}`);
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split('.');
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}
