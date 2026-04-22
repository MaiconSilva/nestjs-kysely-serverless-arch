"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const shared_1 = require("@todolist/shared");
const create_tenant_use_case_1 = require("../application/use-cases/create-tenant.use-case");
const get_tenant_use_case_1 = require("../application/use-cases/get-tenant.use-case");
const tenant_repository_1 = require("../domain/repositories/tenant.repository");
const tenant_kysely_repository_1 = require("../infrastructure/repositories/tenant.kysely.repository");
const tenants_controller_1 = require("./controllers/tenants.controller");
let TenantsModule = class TenantsModule {
};
exports.TenantsModule = TenantsModule;
exports.TenantsModule = TenantsModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_1.KyselyModule],
        controllers: [tenants_controller_1.TenantsController],
        providers: [
            create_tenant_use_case_1.CreateTenantUseCase,
            get_tenant_use_case_1.GetTenantUseCase,
            { provide: tenant_repository_1.TENANT_REPOSITORY, useClass: tenant_kysely_repository_1.TenantKyselyRepository },
            { provide: core_1.APP_GUARD, useClass: shared_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: shared_1.RoleGuard },
        ],
    })
], TenantsModule);
//# sourceMappingURL=tenants.module.js.map