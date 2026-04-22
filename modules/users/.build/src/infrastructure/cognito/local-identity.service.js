"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalIdentityService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Development-only identity provider. Persists a JSON file so that
 * `serverless offline` restarts and separate module processes share the same
 * identity database. Enable by setting AUTH_MODE=local.
 *
 * NEVER ship to production. The token is signed with an HS256 shared secret.
 */
let LocalIdentityService = class LocalIdentityService {
    filePath = process.env.LOCAL_IDENTITY_FILE ??
        (0, path_1.join)(process.cwd(), '.local-auth', 'local-identity.json');
    secret = process.env.JWT_LOCAL_SECRET ?? 'local-dev-secret';
    async createUser(params) {
        const db = this.load();
        const key = params.email.toLowerCase();
        const sub = db[key]?.sub ?? (0, crypto_1.randomUUID)();
        db[key] = {
            sub,
            email: key,
            passwordHash: hash(params.temporaryPassword),
            tenantId: params.tenantId,
            role: params.role,
            name: params.name,
        };
        this.save(db);
        return { sub };
    }
    async authenticate(params) {
        const db = this.load();
        const record = db[params.email.toLowerCase()];
        if (!record || record.passwordHash !== hash(params.password)) {
            throw new Error('Invalid credentials');
        }
        const expiresIn = 3600;
        const token = jsonwebtoken_1.default.sign({
            sub: record.sub,
            email: record.email,
            'custom:tenant_id': record.tenantId,
            'custom:role': record.role,
        }, this.secret, { expiresIn });
        return {
            accessToken: token,
            idToken: token,
            refreshToken: undefined,
            sub: record.sub,
            tenantId: record.tenantId,
            role: record.role,
            expiresIn,
        };
    }
    load() {
        if (!(0, fs_1.existsSync)(this.filePath))
            return {};
        try {
            return JSON.parse((0, fs_1.readFileSync)(this.filePath, 'utf8'));
        }
        catch {
            return {};
        }
    }
    save(db) {
        (0, fs_1.mkdirSync)((0, path_1.dirname)(this.filePath), { recursive: true });
        (0, fs_1.writeFileSync)(this.filePath, JSON.stringify(db, null, 2));
    }
};
exports.LocalIdentityService = LocalIdentityService;
exports.LocalIdentityService = LocalIdentityService = __decorate([
    (0, common_1.Injectable)()
], LocalIdentityService);
function hash(password) {
    return (0, crypto_1.createHash)('sha256').update(password).digest('hex');
}
//# sourceMappingURL=local-identity.service.js.map