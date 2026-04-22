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
exports.KyselyUserLookup = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const shared_1 = require("@todolist/shared");
let KyselyUserLookup = class KyselyUserLookup {
    db;
    constructor(db) {
        this.db = db;
    }
    async findTenantOfUser(tenantId, userId) {
        // Scoping via `withTenant` means RLS filters the row out when the user
        // belongs to a different tenant — we don't need any extra check.
        const row = await (0, shared_1.withTenant)(this.db, tenantId, (trx) => trx
            .selectFrom('users')
            .select(['tenant_id'])
            .where('id', '=', userId)
            .where('active', '=', true)
            .executeTakeFirst());
        return row?.tenant_id ?? null;
    }
    async findUserIdBySub(tenantId, sub) {
        const row = await (0, shared_1.withTenant)(this.db, tenantId, (trx) => trx
            .selectFrom('users')
            .select(['id'])
            .where('cognito_sub', '=', sub)
            .where('active', '=', true)
            .executeTakeFirst());
        return row?.id ?? null;
    }
};
exports.KyselyUserLookup = KyselyUserLookup;
exports.KyselyUserLookup = KyselyUserLookup = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(shared_1.KYSELY)),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], KyselyUserLookup);
//# sourceMappingURL=kysely-user-lookup.js.map