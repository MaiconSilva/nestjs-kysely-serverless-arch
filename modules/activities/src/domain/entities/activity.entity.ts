import { TenantId, UserId } from '@todolist/shared';
import { ActivityId } from '../value-objects/activity-id.vo';
import { ActivityStatus, type StatusValue } from '../value-objects/activity-status.vo';
import {
  ActivityAlreadyAssignedError,
  ActivityAlreadyCompletedError,
  ActivityHasNoAssigneeError,
  InvalidActivityTitleError,
  UserNotBelongsToTenantError,
} from '../errors/activity.errors';

export interface CreateActivityProps {
  tenantId: string;
  title: string;
  description?: string | null;
  createdBy: string;
}

export interface ActivitySnapshot {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  status: StatusValue;
  assigneeId: string | null;
  assignedAt: Date | null;
  completedAt: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Activity {
  private constructor(
    public readonly id: ActivityId,
    public readonly tenantId: TenantId,
    private _title: string,
    private _description: string | null,
    private _status: ActivityStatus,
    private _assigneeId: UserId | null,
    private _assignedAt: Date | null,
    private _completedAt: Date | null,
    public readonly createdBy: UserId,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: CreateActivityProps): Activity {
    const title = props.title.trim();
    if (!title || title.length > 500) {
      throw new InvalidActivityTitleError('Activity title must be 1-500 characters');
    }
    const now = new Date();
    return new Activity(
      ActivityId.generate(),
      TenantId.from(props.tenantId),
      title,
      props.description?.trim() || null,
      ActivityStatus.pending(),
      null,
      null,
      null,
      UserId.from(props.createdBy),
      now,
      now,
    );
  }

  static restore(snap: ActivitySnapshot): Activity {
    return new Activity(
      ActivityId.from(snap.id),
      TenantId.from(snap.tenantId),
      snap.title,
      snap.description,
      ActivityStatus.from(snap.status),
      snap.assigneeId ? UserId.from(snap.assigneeId) : null,
      snap.assignedAt,
      snap.completedAt,
      UserId.from(snap.createdBy),
      snap.createdAt,
      snap.updatedAt,
    );
  }

  get title(): string {
    return this._title;
  }
  get description(): string | null {
    return this._description;
  }
  get status(): ActivityStatus {
    return this._status;
  }
  get assigneeId(): UserId | null {
    return this._assigneeId;
  }
  get assignedAt(): Date | null {
    return this._assignedAt;
  }
  get completedAt(): Date | null {
    return this._completedAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Assigns the activity to a user of the same tenant. Fails if the activity
   * already has another assignee (one-shot assignment per activity in this POC;
   * re-assignment is a future feature).
   */
  assign(userId: string, userTenantId: string): void {
    if (userTenantId !== this.tenantId.value) throw new UserNotBelongsToTenantError();
    if (this._assigneeId !== null) throw new ActivityAlreadyAssignedError(this.id.value);
    this._assigneeId = UserId.from(userId);
    this._assignedAt = new Date();
    this._status = ActivityStatus.assigned();
    this.touch();
  }

  /**
   * Completes the activity. Requires an assignee and rejects double-completion.
   */
  complete(): void {
    if (!this._assigneeId) throw new ActivityHasNoAssigneeError(this.id.value);
    if (this._status.isCompleted()) throw new ActivityAlreadyCompletedError(this.id.value);
    this._status = ActivityStatus.completed();
    this._completedAt = new Date();
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  toSnapshot(): ActivitySnapshot {
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
