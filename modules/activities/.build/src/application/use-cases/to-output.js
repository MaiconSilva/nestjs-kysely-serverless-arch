"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOutput = toOutput;
function toOutput(activity) {
    const s = activity.toSnapshot();
    return {
        id: s.id,
        tenantId: s.tenantId,
        title: s.title,
        description: s.description,
        status: s.status,
        assigneeId: s.assigneeId,
        assignedAt: s.assignedAt?.toISOString() ?? null,
        completedAt: s.completedAt?.toISOString() ?? null,
        createdBy: s.createdBy,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
    };
}
//# sourceMappingURL=to-output.js.map