"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityId = exports.InvalidActivityIdError = void 0;
const crypto_1 = require("crypto");
const shared_1 = require("@todolist/shared");
class InvalidActivityIdError extends shared_1.DomainError {
    code = 'INVALID_ACTIVITY_ID';
    httpStatus = 400;
}
exports.InvalidActivityIdError = InvalidActivityIdError;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
class ActivityId extends shared_1.ValueObject {
    get value() {
        return this.props.value;
    }
    static generate() {
        return new ActivityId({ value: (0, crypto_1.randomUUID)() });
    }
    static from(value) {
        if (!UUID_RE.test(value))
            throw new InvalidActivityIdError(`Invalid activity id: ${value}`);
        return new ActivityId({ value });
    }
}
exports.ActivityId = ActivityId;
//# sourceMappingURL=activity-id.vo.js.map