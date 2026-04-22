"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
/**
 * Base class for Value Objects: immutable and compared by value.
 * Subclasses must pass their payload in `props`; equality relies on JSON equality
 * which is enough for the small VOs in this POC (primitive-backed values).
 */
class ValueObject {
    props;
    constructor(props) {
        this.props = Object.freeze({ ...props });
    }
    equals(other) {
        if (!other)
            return false;
        if (this === other)
            return true;
        if (other.constructor !== this.constructor)
            return false;
        return JSON.stringify(this.props) === JSON.stringify(other.props);
    }
}
exports.ValueObject = ValueObject;
//# sourceMappingURL=value-object.base.js.map