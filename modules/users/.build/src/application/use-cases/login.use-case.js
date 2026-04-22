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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const shared_1 = require("@todolist/shared");
const user_errors_1 = require("../../domain/errors/user.errors");
const user_mapper_1 = require("../../infrastructure/mappers/user.mapper");
const identity_provider_1 = require("../../domain/services/identity-provider");
let LoginUseCase = class LoginUseCase {
    identity;
    db;
    constructor(identity, db) {
        this.identity = identity;
        this.db = db;
    }
    async execute(input) {
        let auth;
        try {
            auth = await this.identity.authenticate({
                email: input.email.trim().toLowerCase(),
                password: input.password,
            });
        }
        catch {
            throw new user_errors_1.InvalidCredentialsError();
        }
        // Tenant id comes straight from the verified Cognito token — we trust it
        // because `authenticate()` validated the signature.
        const tenantRow = await this.db
            .selectFrom('tenants')
            .select(['id', 'active'])
            .where('id', '=', auth.tenantId)
            .executeTakeFirst();
        if (!tenantRow)
            throw new user_errors_1.TenantInactiveLoginError();
        if (!tenantRow.active)
            throw new user_errors_1.TenantInactiveLoginError();
        // RLS is satisfied: we scope the user lookup by the tenant from the token.
        const userRow = await (0, shared_1.withTenant)(this.db, auth.tenantId, (trx) => trx
            .selectFrom('users')
            .selectAll()
            .where('cognito_sub', '=', auth.sub)
            .executeTakeFirst());
        if (!userRow)
            throw new user_errors_1.UserNotFoundError(auth.sub);
        const user = user_mapper_1.UserMapperLike.toDomain(userRow);
        const snap = user.toSnapshot();
        return {
            accessToken: auth.accessToken,
            idToken: auth.idToken,
            refreshToken: auth.refreshToken,
            expiresIn: auth.expiresIn,
            user: {
                id: snap.id,
                tenantId: snap.tenantId,
                name: snap.name,
                email: snap.email,
                role: snap.role,
            },
        };
    }
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(identity_provider_1.IDENTITY_PROVIDER)),
    __param(1, (0, common_1.Inject)(shared_1.KYSELY)),
    __metadata("design:paramtypes", [Object, kysely_1.Kysely])
], LoginUseCase);
//# sourceMappingURL=login.use-case.js.map