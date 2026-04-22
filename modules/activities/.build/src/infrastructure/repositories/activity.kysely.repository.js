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
exports.ActivityKyselyRepository = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const shared_1 = require("@todolist/shared");
const activity_mapper_1 = require("../mappers/activity.mapper");
let ActivityKyselyRepository = class ActivityKyselyRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findById(tenantId, id) {
        const row = await (0, shared_1.withTenant)(this.db, tenantId, (trx) => trx.selectFrom('activities').selectAll().where('id', '=', id).executeTakeFirst());
        return row ? activity_mapper_1.ActivityMapper.toDomain(row) : null;
    }
    async listByTenant(tenantId, filter = {}) {
        const rows = await (0, shared_1.withTenant)(this.db, tenantId, (trx) => {
            let q = trx.selectFrom('activities').selectAll();
            if (filter.status)
                q = q.where('status', '=', filter.status);
            if (filter.assigneeId)
                q = q.where('assignee_id', '=', filter.assigneeId);
            return q.orderBy('created_at', 'desc').execute();
        });
        return rows.map(activity_mapper_1.ActivityMapper.toDomain);
    }
    /**
     * Finds the (at most one) active activity a user currently holds. Used by
     * `AssignActivityUseCase` to enforce "one activity per user". The partial
     * unique index `idx_activities_one_active_per_user` in the schema is the
     * database-level safety net.
     */
    async findActiveByAssignee(tenantId, userId) {
        const row = await (0, shared_1.withTenant)(this.db, tenantId, (trx) => trx
            .selectFrom('activities')
            .selectAll()
            .where('assignee_id', '=', userId)
            .where('status', '!=', 'completed')
            .limit(1)
            .executeTakeFirst());
        return row ? activity_mapper_1.ActivityMapper.toDomain(row) : null;
    }
    async save(activity) {
        const values = activity_mapper_1.ActivityMapper.toPersistence(activity);
        await (0, shared_1.withTenant)(this.db, values.tenant_id, (trx) => trx
            .insertInto('activities')
            .values(values)
            .onConflict((oc) => oc.column('id').doUpdateSet({
            title: values.title,
            description: values.description,
            status: values.status,
            assignee_id: values.assignee_id,
            assigned_at: values.assigned_at,
            completed_at: values.completed_at,
            updated_at: values.updated_at,
        }))
            .execute());
    }
};
exports.ActivityKyselyRepository = ActivityKyselyRepository;
exports.ActivityKyselyRepository = ActivityKyselyRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(shared_1.KYSELY)),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], ActivityKyselyRepository);
//# sourceMappingURL=activity.kysely.repository.js.map