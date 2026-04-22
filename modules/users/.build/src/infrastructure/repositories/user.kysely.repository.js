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
exports.UserKyselyRepository = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const shared_1 = require("@todolist/shared");
const user_mapper_1 = require("../mappers/user.mapper");
let UserKyselyRepository = class UserKyselyRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findByIdInTenant(tenantId, id) {
        const row = await (0, shared_1.withTenant)(this.db, tenantId, (trx) => trx.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst());
        return row ? user_mapper_1.UserMapper.toDomain(row) : null;
    }
    async findByEmailInTenant(tenantId, email) {
        const row = await (0, shared_1.withTenant)(this.db, tenantId, (trx) => trx.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst());
        return row ? user_mapper_1.UserMapper.toDomain(row) : null;
    }
    /**
     * Login path: the tenant context must have been set by the caller before
     * invoking this method (see `LoginUseCase`, which sets it from the verified
     * JWT). Used by `@todolist/activities` and internal code paths that already
     * know the tenant.
     */
    async findByCognitoSub(sub) {
        // Whoever calls this outside a tenant context gets no rows because RLS
        // hides them — that's intentional, we only look up by sub when we already
        // know the tenant (post-auth).
        const row = await this.db
            .selectFrom('users')
            .selectAll()
            .where('cognito_sub', '=', sub)
            .executeTakeFirst();
        return row ? user_mapper_1.UserMapper.toDomain(row) : null;
    }
    async listByTenant(tenantId) {
        const rows = await (0, shared_1.withTenant)(this.db, tenantId, (trx) => trx.selectFrom('users').selectAll().orderBy('created_at', 'asc').execute());
        return rows.map(user_mapper_1.UserMapper.toDomain);
    }
    async save(user) {
        const values = user_mapper_1.UserMapper.toPersistence(user);
        await (0, shared_1.withTenant)(this.db, values.tenant_id, (trx) => trx
            .insertInto('users')
            .values(values)
            .onConflict((oc) => oc.columns(['tenant_id', 'email']).doUpdateSet({
            name: values.name,
            role: values.role,
            cognito_sub: values.cognito_sub,
            active: values.active,
        }))
            .execute());
    }
};
exports.UserKyselyRepository = UserKyselyRepository;
exports.UserKyselyRepository = UserKyselyRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(shared_1.KYSELY)),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], UserKyselyRepository);
//# sourceMappingURL=user.kysely.repository.js.map