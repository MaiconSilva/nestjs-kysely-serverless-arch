"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const shared_1 = require("@todolist/shared");
const role_vo_1 = require("../value-objects/role.vo");
class InvalidUserNameError extends shared_1.DomainError {
    code = 'INVALID_USER_NAME';
    httpStatus = 400;
}
class User {
    id;
    tenantId;
    _name;
    email;
    _role;
    _cognitoSub;
    _active;
    createdAt;
    constructor(id, tenantId, _name, email, _role, _cognitoSub, _active, createdAt) {
        this.id = id;
        this.tenantId = tenantId;
        this._name = _name;
        this.email = email;
        this._role = _role;
        this._cognitoSub = _cognitoSub;
        this._active = _active;
        this.createdAt = createdAt;
    }
    static create(props) {
        const name = props.name.trim();
        if (!name || name.length > 255) {
            throw new InvalidUserNameError('User name must be 1-255 characters');
        }
        return new User(shared_1.UserId.generate(), shared_1.TenantId.from(props.tenantId), name, shared_1.Email.from(props.email), role_vo_1.Role.from(props.role ?? 'member'), props.cognitoSub ?? null, true, new Date());
    }
    static restore(snapshot) {
        return new User(shared_1.UserId.from(snapshot.id), shared_1.TenantId.from(snapshot.tenantId), snapshot.name, shared_1.Email.from(snapshot.email), role_vo_1.Role.from(snapshot.role), snapshot.cognitoSub, snapshot.active, snapshot.createdAt);
    }
    get name() {
        return this._name;
    }
    get role() {
        return this._role;
    }
    get cognitoSub() {
        return this._cognitoSub;
    }
    get active() {
        return this._active;
    }
    linkCognitoSub(sub) {
        this._cognitoSub = sub;
    }
    deactivate() {
        this._active = false;
    }
    promoteToAdmin() {
        this._role = role_vo_1.Role.ADMIN;
    }
    toSnapshot() {
        return {
            id: this.id.value,
            tenantId: this.tenantId.value,
            name: this._name,
            email: this.email.value,
            role: this._role.value,
            cognitoSub: this._cognitoSub,
            active: this._active,
            createdAt: this.createdAt,
        };
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map