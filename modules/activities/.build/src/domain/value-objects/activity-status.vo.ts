import { DomainError, ValueObject } from '@todolist/shared';

export class InvalidActivityStatusError extends DomainError {
  readonly code = 'INVALID_ACTIVITY_STATUS';
  readonly httpStatus = 400;
}

export type StatusValue = 'pending' | 'assigned' | 'completed';

interface Props {
  value: StatusValue;
}

export class ActivityStatus extends ValueObject<Props> {
  private static readonly PENDING = new ActivityStatus({ value: 'pending' });
  private static readonly ASSIGNED = new ActivityStatus({ value: 'assigned' });
  private static readonly COMPLETED = new ActivityStatus({ value: 'completed' });

  get value(): StatusValue {
    return this.props.value;
  }

  static pending(): ActivityStatus {
    return ActivityStatus.PENDING;
  }

  static assigned(): ActivityStatus {
    return ActivityStatus.ASSIGNED;
  }

  static completed(): ActivityStatus {
    return ActivityStatus.COMPLETED;
  }

  static from(raw: string): ActivityStatus {
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

  isCompleted(): boolean {
    return this.props.value === 'completed';
  }

  isPending(): boolean {
    return this.props.value === 'pending';
  }

  isAssigned(): boolean {
    return this.props.value === 'assigned';
  }
}
