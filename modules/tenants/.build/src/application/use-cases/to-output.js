"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOutput = toOutput;
function toOutput(tenant) {
    const snap = tenant.toSnapshot();
    return {
        id: snap.id,
        name: snap.name,
        slug: snap.slug,
        active: snap.active,
        createdAt: snap.createdAt.toISOString(),
    };
}
//# sourceMappingURL=to-output.js.map