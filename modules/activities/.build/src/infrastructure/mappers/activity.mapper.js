"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityMapper = void 0;
const activity_entity_1 = require("../../domain/entities/activity.entity");
function toDateOrNull(v) {
    if (v == null)
        return null;
    return v instanceof Date ? v : new Date(String(v));
}
function toDate(v) {
    return v instanceof Date ? v : new Date(String(v));
}
exports.ActivityMapper = {
    toDomain(row) {
        return activity_entity_1.Activity.restore({
            id: row.id,
            tenantId: row.tenant_id,
            title: row.title,
            description: row.description,
            status: row.status,
            assigneeId: row.assignee_id,
            assignedAt: toDateOrNull(row.assigned_at),
            completedAt: toDateOrNull(row.completed_at),
            createdBy: row.created_by,
            createdAt: toDate(row.created_at),
            updatedAt: toDate(row.updated_at),
        });
    },
    toPersistence(a) {
        const s = a.toSnapshot();
        return {
            id: s.id,
            tenant_id: s.tenantId,
            title: s.title,
            description: s.description,
            status: s.status,
            assignee_id: s.assigneeId,
            assigned_at: s.assignedAt,
            completed_at: s.completedAt,
            created_by: s.createdBy,
            created_at: s.createdAt,
            updated_at: s.updatedAt,
        };
    },
};
//# sourceMappingURL=activity.mapper.js.map