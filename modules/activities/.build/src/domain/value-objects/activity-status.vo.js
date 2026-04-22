"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityStatus = exports.InvalidActivityStatusError = void 0;
const shared_1 = require("@todolist/shared");
class InvalidActivityStatusError extends shared_1.DomainError {
    code = 'INVALID_ACTIVITY_STATUS';
    httpStatus = 400;
}
exports.InvalidActivityStatusError = InvalidActivityStatusError;
class ActivityStatus extends shared_1.ValueObject {
    static PENDING = new ActivityStatus({ value: 'pending' });
    static ASSIGNED = new ActivityStatus({ value: 'assigned' });
    static COMPLETED = new ActivityStatus({ value: 'completed' });
    get value() {
        return this.props.value;
    }
    static pending() {
        return ActivityStatus.PENDING;
    }
    static assigned() {
        return ActivityStatus.ASSIGNED;
    }
    static completed() {
        return ActivityStatus.COMPLETED;
    }
    static from(raw) {
        switch (raw) {
            case 'pending':
                return ActivityStatus.PENDING;
            case 'assigned':
                return ActivityStatus.ASSIGNED;
            case 'completed':
                return ActivityStatus.COMPLETED;
            default:
                throw new InvalidActivityStatusError(`Unknown activity status: ${raw}`);
        }
    }
    isCompleted() {
        return this.props.value === 'completed';
    }
    isPending() {
        return this.props.value === 'pending';
    }
    isAssigned() {
        return this.props.value === 'assigned';
    }
}
exports.ActivityStatus = ActivityStatus;
//# sourceMappingURL=activity-status.vo.js.map