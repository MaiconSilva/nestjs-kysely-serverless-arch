"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tenant = void 0;
const shared_1 = require("@todolist/shared");
const slug_vo_1 = require("../value-objects/slug.vo");
class InvalidTenantNameError extends shared_1.DomainError {
    code = 'INVALID_TENANT_NAME';
    httpStatus = 400;
}
class Tenant {
    id;
    _name;
    slug;
    _active;
    createdAt;
    constructor(id, _name, slug, _active, createdAt) {
        this.id = id;
        this._name = _name;
        this.slug = slug;
        this._active = _active;
        this.createdAt = createdAt;
    }
    static create(props) {
        const name = props.name.trim();
        if (!name || name.length > 255) {
            throw new InvalidTenantNameError('Tenant name must be 1-255 characters');
        }
        return new Tenant(shared_1.TenantId.generate(), name, slug_vo_1.Slug.from(props.slug), true, new Date());
    }
    static restore(snapshot) {
        return new Tenant(shared_1.TenantId.from(snapshot.id), snapshot.name, slug_vo_1.Slug.from(snapshot.slug), snapshot.active, snapshot.createdAt);
    }
    get name() {
        return this._name;
    }
    get active() {
        return this._active;
    }
    deactivate() {
        this._active = false;
    }
    reactivate() {
        this._active = true;
    }
    toSnapshot() {
        return {
            id: this.id.value,
            name: this._name,
            slug: this.slug.value,
            active: this._active,
            createdAt: this.createdAt,
        };
    }
}
exports.Tenant = Tenant;
//# sourceMappingURL=tenant.entity.js.map