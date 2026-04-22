"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalHsJwtVerifier = exports.CognitoJwtVerifierImpl = void 0;
exports.getJwtVerifier = getJwtVerifier;
exports.resetJwtVerifier = resetJwtVerifier;
const aws_jwt_verify_1 = require("aws-jwt-verify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Cognito verifier — validates signature against the User Pool JWKS.
 * `aws-jwt-verify` caches the JWKS in memory so the remote fetch happens once
 * per cold start.
 */
class CognitoJwtVerifierImpl {
    verifier;
    constructor(params) {
        this.verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
            userPoolId: params.userPoolId,
            tokenUse: params.tokenUse ?? 'access',
            clientId: params.clientId,
        });
    }
    async verify(token) {
        const payload = await this.verifier.verify(token);
        const tenantId = payload['custom:tenant_id'];
        const role = payload['custom:role'];
        if (typeof tenantId !== 'string')
            throw new Error('Missing custom:tenant_id claim');
        if (role !== 'admin' && role !== 'member')
            throw new Error('Invalid custom:role claim');
        return {
            sub: payload.sub,
            tenantId,
            role,
            email: payload.email,
        };
    }
}
exports.CognitoJwtVerifierImpl = CognitoJwtVerifierImpl;
/**
 * Local HS256 verifier. Used on `serverless offline` and integration tests so
 * we don't need a real AWS Cognito pool running to exercise the auth path.
 * Enable it by setting AUTH_MODE=local and JWT_LOCAL_SECRET.
 */
class LocalHsJwtVerifier {
    secret;
    constructor(secret) {
        this.secret = secret;
    }
    async verify(token) {
        const payload = jsonwebtoken_1.default.verify(token, this.secret);
        const tenantId = payload['custom:tenant_id'] ?? payload.tenantId;
        const role = payload['custom:role'] ?? payload.role;
        if (typeof tenantId !== 'string')
            throw new Error('Missing tenantId claim');
        if (role !== 'admin' && role !== 'member')
            throw new Error('Invalid role claim');
        if (typeof payload.sub !== 'string')
            throw new Error('Missing sub claim');
        return {
            sub: payload.sub,
            tenantId,
            role,
            email: payload.email,
        };
    }
    sign(claims, ttlSeconds = 3600) {
        return jsonwebtoken_1.default.sign({
            sub: claims.sub,
            'custom:tenant_id': claims.tenantId,
            'custom:role': claims.role,
            email: claims.email,
        }, this.secret, { expiresIn: ttlSeconds });
    }
}
exports.LocalHsJwtVerifier = LocalHsJwtVerifier;
let verifierInstance = null;
function getJwtVerifier() {
    if (verifierInstance)
        return verifierInstance;
    const mode = process.env.AUTH_MODE ?? (process.env.COGNITO_USER_POOL_ID ? 'cognito' : 'local');
    if (mode === 'cognito') {
        verifierInstance = new CognitoJwtVerifierImpl({
            userPoolId: required('COGNITO_USER_POOL_ID'),
            clientId: required('COGNITO_CLIENT_ID'),
            tokenUse: process.env.COGNITO_TOKEN_USE ?? 'access',
        });
    }
    else {
        verifierInstance = new LocalHsJwtVerifier(required('JWT_LOCAL_SECRET'));
    }
    return verifierInstance;
}
function resetJwtVerifier() {
    verifierInstance = null;
}
function required(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing required env var ${name}`);
    return v;
}
//# sourceMappingURL=jwt-verifier.js.map