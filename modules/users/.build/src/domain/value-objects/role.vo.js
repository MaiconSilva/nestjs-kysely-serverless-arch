"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.InvalidRoleError = void 0;
const shared_1 = require("@todolist/shared");
class InvalidRoleError extends shared_1.DomainError {
    code = 'INVALID_ROLE';
    httpStatus = 400;
}
exports.InvalidRoleError = InvalidRoleError;
class Role extends shared_1.ValueObject {
    static ADMIN = new Role({ value: 'admin' });
    static MEMBER = new Role({ value: 'member' });
    get value() {
        return this.props.value;
    }
    isAdmin() {
        return this.props.value === 'admin';
    }
    static from(raw) {
        if (raw === 'admin')
            return Role.ADMIN;
        if (raw === 'member')
            return Role.MEMBER;
        throw new InvalidRoleError(`Invalid role: ${raw}`);
    }
}
exports.Role = Role;
//# sourceMappingURL=role.vo.js.map