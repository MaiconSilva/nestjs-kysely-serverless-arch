"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
/**
 * Base class for domain entities. Equality is based on identity (id),
 * never on attribute values — that's what distinguishes an Entity from a Value Object.
 */
class Entity {
    id;
    constructor(id) {
        this.id = id;
    }
    equals(other) {
        if (!other)
            return false;
        if (this === other)
            return true;
        return this.id.value === other.id.value;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.base.js.map