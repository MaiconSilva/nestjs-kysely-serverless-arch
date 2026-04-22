"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = exports.UserMapperLike = void 0;
const user_entity_1 = require("../../domain/entities/user.entity");
exports.UserMapperLike = {
    toDomain(row) {
        const created = row.created_at;
        return user_entity_1.User.restore({
            id: row.id,
            tenantId: row.tenant_id,
            name: row.name,
            email: row.email,
            role: row.role,
            cognitoSub: row.cognito_sub,
            active: row.active,
            createdAt: created instanceof Date ? created : new Date(String(created)),
        });
    },
    toPersistence(user) {
        const snap = user.toSnapshot();
        return {
            id: snap.id,
            tenant_id: snap.tenantId,
            name: snap.name,
            email: snap.email,
            role: snap.role,
            cognito_sub: snap.cognitoSub,
            active: snap.active,
        };
    },
};
exports.UserMapper = exports.UserMapperLike;
//# sourceMappingURL=user.mapper.js.map