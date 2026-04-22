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
exports.TenantKyselyRepository = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const shared_1 = require("@todolist/shared");
const tenant_mapper_1 = require("../mappers/tenant.mapper");
let TenantKyselyRepository = class TenantKyselyRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    // Tenants table has no RLS — administrative access is intentional.
    async findById(id) {
        const row = await this.db
            .selectFrom('tenants')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
        return row ? tenant_mapper_1.TenantMapper.toDomain(row) : null;
    }
    async findBySlug(slug) {
        const row = await this.db
            .selectFrom('tenants')
            .selectAll()
            .where('slug', '=', slug)
            .executeTakeFirst();
        return row ? tenant_mapper_1.TenantMapper.toDomain(row) : null;
    }
    async save(tenant) {
        const values = tenant_mapper_1.TenantMapper.toPersistence(tenant);
        await this.db
            .insertInto('tenants')
            .values(values)
            .onConflict((oc) => oc.column('id').doUpdateSet({
            name: values.name,
            active: values.active,
        }))
            .execute();
    }
};
exports.TenantKyselyRepository = TenantKyselyRepository;
exports.TenantKyselyRepository = TenantKyselyRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(shared_1.KYSELY)),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], TenantKyselyRepository);
//# sourceMappingURL=tenant.kysely.repository.js.map