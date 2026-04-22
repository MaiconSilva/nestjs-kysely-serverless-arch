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
exports.CreateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../domain/entities/user.entity");
const user_errors_1 = require("../../domain/errors/user.errors");
const user_repository_1 = require("../../domain/repositories/user.repository");
const identity_provider_1 = require("../../domain/services/identity-provider");
const to_output_1 = require("./to-output");
let CreateUserUseCase = class CreateUserUseCase {
    users;
    identity;
    constructor(users, identity) {
        this.users = users;
        this.identity = identity;
    }
    async execute(tenantId, input) {
        const emailNormalized = input.email.trim().toLowerCase();
        const existing = await this.users.findByEmailInTenant(tenantId, emailNormalized);
        if (existing)
            throw new user_errors_1.EmailAlreadyExistsError(emailNormalized);
        const role = input.role ?? 'member';
        // Create in Cognito first so, if it fails, we don't end up with a dangling DB row.
        const { sub } = await this.identity.createUser({
            email: emailNormalized,
            temporaryPassword: input.temporaryPassword,
            tenantId,
            role,
            name: input.name,
        });
        const user = user_entity_1.User.create({
            tenantId,
            name: input.name,
            email: emailNormalized,
            role,
            cognitoSub: sub,
        });
        await this.users.save(user);
        return (0, to_output_1.toOutput)(user);
    }
};
exports.CreateUserUseCase = CreateUserUseCase;
exports.CreateUserUseCase = CreateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(identity_provider_1.IDENTITY_PROVIDER)),
    __metadata("design:paramtypes", [Object, Object])
], CreateUserUseCase);
//# sourceMappingURL=create-user.use-case.js.map