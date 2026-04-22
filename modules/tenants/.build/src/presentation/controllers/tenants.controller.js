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
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@todolist/shared");
const create_tenant_input_1 = require("../../application/dtos/create-tenant.input");
const create_tenant_use_case_1 = require("../../application/use-cases/create-tenant.use-case");
const get_tenant_use_case_1 = require("../../application/use-cases/get-tenant.use-case");
let TenantsController = class TenantsController {
    createTenant;
    getTenant;
    constructor(createTenant, getTenant) {
        this.createTenant = createTenant;
        this.getTenant = getTenant;
    }
    // Tenant signup is intentionally public — the caller doesn't yet belong anywhere.
    create(input) {
        return this.createTenant.execute(input);
    }
    find(id) {
        return this.getTenant.execute(id);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, shared_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tenant_input_1.CreateTenantInput]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "find", null);
exports.TenantsController = TenantsController = __decorate([
    (0, common_1.Controller)('tenants'),
    __metadata("design:paramtypes", [create_tenant_use_case_1.CreateTenantUseCase,
        get_tenant_use_case_1.GetTenantUseCase])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map