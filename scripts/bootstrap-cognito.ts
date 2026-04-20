/**
 * One-shot bootstrap script — creates the Cognito User Pool, app client and
 * custom attributes (tenant_id, role), then stores the resulting ids in SSM.
 *
 * Usage:
 *   STAGE=dev AWS_REGION=us-east-1 ts-node scripts/bootstrap-cognito.ts
 *   # or point at LocalStack:
 *   COGNITO_ENDPOINT=http://localhost:4566 STAGE=local ts-node scripts/bootstrap-cognito.ts
 */
import {
  CognitoIdentityProviderClient,
  CreateUserPoolClientCommand,
  CreateUserPoolCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

async function main(): Promise<void> {
  const stage = process.env.STAGE ?? 'local';
  const region = process.env.AWS_REGION ?? 'us-east-1';
  const endpoint = process.env.COGNITO_ENDPOINT;

  const cognito = new CognitoIdentityProviderClient({
    region,
    ...(endpoint ? { endpoint } : {}),
  });
  const ssm = new SSMClient({
    region,
    ...(endpoint ? { endpoint } : {}),
  });

  const pool = await cognito.send(
    new CreateUserPoolCommand({
      PoolName: `todolist-${stage}`,
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email'],
      Schema: [
        { Name: 'email', Required: true, Mutable: true, AttributeDataType: 'String' },
        { Name: 'name', Required: false, Mutable: true, AttributeDataType: 'String' },
        { Name: 'tenant_id', Mutable: true, AttributeDataType: 'String' },
        { Name: 'role', Mutable: true, AttributeDataType: 'String' },
      ],
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireNumbers: true,
          RequireSymbols: false,
          RequireUppercase: false,
          RequireLowercase: false,
        },
      },
    }),
  );
  const userPoolId = pool.UserPool?.Id;
  if (!userPoolId) throw new Error('CreateUserPool did not return Id');

  const client = await cognito.send(
    new CreateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientName: `todolist-${stage}-client`,
      GenerateSecret: false,
      ExplicitAuthFlows: [
        'ADMIN_USER_PASSWORD_AUTH',
        'ALLOW_ADMIN_USER_PASSWORD_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
      ],
      AccessTokenValidity: 1,
      IdTokenValidity: 1,
      TokenValidityUnits: { AccessToken: 'hours', IdToken: 'hours' },
    }),
  );
  const clientId = client.UserPoolClient?.ClientId;
  if (!clientId) throw new Error('CreateUserPoolClient did not return ClientId');

  await ssm.send(
    new PutParameterCommand({
      Name: `/todolist/${stage}/cognito/user-pool-id`,
      Value: userPoolId,
      Type: 'String',
      Overwrite: true,
    }),
  );
  await ssm.send(
    new PutParameterCommand({
      Name: `/todolist/${stage}/cognito/client-id`,
      Value: clientId,
      Type: 'String',
      Overwrite: true,
    }),
  );

  console.log(`[cognito] User Pool: ${userPoolId}`);
  console.log(`[cognito] Client:    ${clientId}`);
  console.log(`[ssm] Stored at /todolist/${stage}/cognito/*`);
}

main().catch((err) => {
  console.error('[bootstrap-cognito] failed', err);
  process.exit(1);
});
