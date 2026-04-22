"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOutput = toOutput;
function toOutput(user) {
    const snap = user.toSnapshot();
    return {
        id: snap.id,
        tenantId: snap.tenantId,
        name: snap.name,
        email: snap.email,
        role: snap.role,
        active: snap.active,
        createdAt: snap.createdAt.toISOString(),
    };
}
//# sourceMappingURL=to-output.js.map