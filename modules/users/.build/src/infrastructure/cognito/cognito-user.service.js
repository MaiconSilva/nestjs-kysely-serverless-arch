"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CognitoUserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoUserService = void 0;
const common_1 = require("@nestjs/common");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
let CognitoUserService = CognitoUserService_1 = class CognitoUserService {
    logger = new common_1.Logger(CognitoUserService_1.name);
    client;
    userPoolId;
    clientId;
    constructor(cfg) {
        const region = cfg?.region ?? process.env.AWS_REGION ?? 'us-east-1';
        const endpoint = cfg?.endpoint ?? process.env.COGNITO_ENDPOINT;
        this.userPoolId = cfg?.userPoolId ?? required('COGNITO_USER_POOL_ID');
        this.clientId = cfg?.clientId ?? required('COGNITO_CLIENT_ID');
        this.client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
            region,
            ...(endpoint ? { endpoint } : {}),
        });
    }
    async createUser(params) {
        const createRes = await this.client.send(new client_cognito_identity_provider_1.AdminCreateUserCommand({
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
        }));
        // Set the password as permanent so the user doesn't have to go through
        // NEW_PASSWORD_REQUIRED on first login — this POC trades convenience for
        // production-grade flow.
        await this.client.send(new client_cognito_identity_provider_1.AdminSetUserPasswordCommand({
            UserPoolId: this.userPoolId,
            Username: params.email,
            Password: params.temporaryPassword,
            Permanent: true,
        }));
        const sub = createRes.User?.Attributes?.find((a) => a.Name === 'sub')?.Value ?? null;
        if (!sub)
            throw new Error('Cognito AdminCreateUser did not return sub');
        return { sub };
    }
    async authenticate(params) {
        const res = await this.client.send(new client_cognito_identity_provider_1.AdminInitiateAuthCommand({
            UserPoolId: this.userPoolId,
            ClientId: this.clientId,
            AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
            AuthParameters: {
                USERNAME: params.email,
                PASSWORD: params.password,
            },
        }));
        const auth = res.AuthenticationResult;
        if (!auth?.AccessToken || !auth?.IdToken) {
            throw new Error('Cognito authentication did not return tokens');
        }
        const decoded = decodeJwtPayload(auth.IdToken);
        const sub = decoded.sub;
        const tenantId = decoded['custom:tenant_id'];
        const role = decoded['custom:role'];
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
    async updateRole(sub, email, role) {
        await this.client.send(new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand({
            UserPoolId: this.userPoolId,
            Username: email,
            UserAttributes: [{ Name: 'custom:role', Value: role }],
        }));
        this.logger.log(`Updated Cognito role of ${sub} to ${role}`);
    }
};
exports.CognitoUserService = CognitoUserService;
exports.CognitoUserService = CognitoUserService = CognitoUserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], CognitoUserService);
function decodeJwtPayload(token) {
    const [, payload] = token.split('.');
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
}
function required(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing required env var ${name}`);
    return v;
}
//# sourceMappingURL=cognito-user.service.js.map