"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMapper = void 0;
const tenant_entity_1 = require("../../domain/entities/tenant.entity");
exports.TenantMapper = {
    toDomain(row) {
        const created = row.created_at;
        return tenant_entity_1.Tenant.restore({
            id: row.id,
            name: row.name,
            slug: row.slug,
            active: row.active,
            createdAt: created instanceof Date ? created : new Date(String(created)),
        });
    },
    toPersistence(tenant) {
        const snap = tenant.toSnapshot();
        return {
            id: snap.id,
            name: snap.name,
            slug: snap.slug,
            active: snap.active,
        };
    },
};
//# sourceMappingURL=tenant.mapper.js.map