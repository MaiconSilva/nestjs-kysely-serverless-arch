"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const shared_1 = require("@todolist/shared");
const create_user_use_case_1 = require("../application/use-cases/create-user.use-case");
const list_users_use_case_1 = require("../application/use-cases/list-users.use-case");
const login_use_case_1 = require("../application/use-cases/login.use-case");
const user_repository_1 = require("../domain/repositories/user.repository");
const identity_provider_1 = require("../domain/services/identity-provider");
const cognito_user_service_1 = require("../infrastructure/cognito/cognito-user.service");
const local_identity_service_1 = require("../infrastructure/cognito/local-identity.service");
const user_kysely_repository_1 = require("../infrastructure/repositories/user.kysely.repository");
const auth_controller_1 = require("./controllers/auth.controller");
const users_controller_1 = require("./controllers/users.controller");
const identityProvider = {
    provide: identity_provider_1.IDENTITY_PROVIDER,
    useFactory: () => {
        const mode = process.env.AUTH_MODE ?? (process.env.COGNITO_USER_POOL_ID ? 'cognito' : 'local');
        if (mode === 'cognito')
            return new cognito_user_service_1.CognitoUserService();
        return new local_identity_service_1.LocalIdentityService();
    },
};
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_1.KyselyModule],
        controllers: [auth_controller_1.AuthController, users_controller_1.UsersController],
        providers: [
            create_user_use_case_1.CreateUserUseCase,
            list_users_use_case_1.ListUsersUseCase,
            login_use_case_1.LoginUseCase,
            { provide: user_repository_1.USER_REPOSITORY, useClass: user_kysely_repository_1.UserKyselyRepository },
            identityProvider,
            { provide: core_1.APP_GUARD, useClass: shared_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: shared_1.RoleGuard },
        ],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map