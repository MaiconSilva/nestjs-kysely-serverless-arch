"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const shared_1 = require("@todolist/shared");
const activity_id_vo_1 = require("../value-objects/activity-id.vo");
const activity_status_vo_1 = require("../value-objects/activity-status.vo");
const activity_errors_1 = require("../errors/activity.errors");
class Activity {
    id;
    tenantId;
    _title;
    _description;
    _status;
    _assigneeId;
    _assignedAt;
    _completedAt;
    createdBy;
    createdAt;
    _updatedAt;
    constructor(id, tenantId, _title, _description, _status, _assigneeId, _assignedAt, _completedAt, createdBy, createdAt, _updatedAt) {
        this.id = id;
        this.tenantId = tenantId;
        this._title = _title;
        this._description = _description;
        this._status = _status;
        this._assigneeId = _assigneeId;
        this._assignedAt = _assignedAt;
        this._completedAt = _completedAt;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this._updatedAt = _updatedAt;
    }
    static create(props) {
        const title = props.title.trim();
        if (!title || title.length > 500) {
            throw new activity_errors_1.InvalidActivityTitleError('Activity title must be 1-500 characters');
        }
        const now = new Date();
        return new Activity(activity_id_vo_1.ActivityId.generate(), shared_1.TenantId.from(props.tenantId), title, props.description?.trim() || null, activity_status_vo_1.ActivityStatus.pending(), null, null, null, shared_1.UserId.from(props.createdBy), now, now);
    }
    static restore(snap) {
        return new Activity(activity_id_vo_1.ActivityId.from(snap.id), shared_1.TenantId.from(snap.tenantId), snap.title, snap.description, activity_status_vo_1.ActivityStatus.from(snap.status), snap.assigneeId ? shared_1.UserId.from(snap.assigneeId) : null, snap.assignedAt, snap.completedAt, shared_1.UserId.from(snap.createdBy), snap.createdAt, snap.updatedAt);
    }
    get title() {
        return this._title;
    }
    get description() {
        return this._description;
    }
    get status() {
        return this._status;
    }
    get assigneeId() {
        return this._assigneeId;
    }
    get assignedAt() {
        return this._assignedAt;
    }
    get completedAt() {
        return this._completedAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    /**
     * Assigns the activity to a user of the same tenant. Fails if the activity
     * already has another assignee (one-shot assignment per activity in this POC;
     * re-assignment is a future feature).
     */
    assign(userId, userTenantId) {
        if (userTenantId !== this.tenantId.value)
            throw new activity_errors_1.UserNotBelongsToTenantError();
        if (this._assigneeId !== null)
            throw new activity_errors_1.ActivityAlreadyAssignedError(this.id.value);
        this._assigneeId = shared_1.UserId.from(userId);
        this._assignedAt = new Date();
        this._status = activity_status_vo_1.ActivityStatus.assigned();
        this.touch();
    }
    /**
     * Completes the activity. Requires an assignee and rejects double-completion.
     */
    complete() {
        if (!this._assigneeId)
            throw new activity_errors_1.ActivityHasNoAssigneeError(this.id.value);
        if (this._status.isCompleted())
            throw new activity_errors_1.ActivityAlreadyCompletedError(this.id.value);
        this._status = activity_status_vo_1.ActivityStatus.completed();
        this._completedAt = new Date();
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
    toSnapshot() {
        return {
            id: this.id.value,
            tenantId: this.tenantId.value,
            title: this._title,
            description: this._description,
            status: this._status.value,
            assigneeId: this._assigneeId?.value ?? null,
            assignedAt: this._assignedAt,
            completedAt: this._completedAt,
            createdBy: this.createdBy.value,
            createdAt: this.createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
exports.Activity = Activity;
//# sourceMappingURL=activity.entity.js.map