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
exports.GetTenantUseCase = void 0;
const common_1 = require("@nestjs/common");
const tenant_errors_1 = require("../../domain/errors/tenant.errors");
const tenant_repository_1 = require("../../domain/repositories/tenant.repository");
const to_output_1 = require("./to-output");
let GetTenantUseCase = class GetTenantUseCase {
    tenants;
    constructor(tenants) {
        this.tenants = tenants;
    }
    async execute(id) {
        const tenant = await this.tenants.findById(id);
        if (!tenant)
            throw new tenant_errors_1.TenantNotFoundError(id);
        return (0, to_output_1.toOutput)(tenant);
    }
};
exports.GetTenantUseCase = GetTenantUseCase;
exports.GetTenantUseCase = GetTenantUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tenant_repository_1.TENANT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetTenantUseCase);
//# sourceMappingURL=get-tenant.use-case.js.map