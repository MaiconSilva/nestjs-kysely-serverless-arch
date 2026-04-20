import type { Activity } from '../../domain/entities/activity.entity';
import type { ActivityOutput } from '../dtos/activity.dto';

export function toOutput(activity: Activity): ActivityOutput {
  const s = activity.toSnapshot();
  return {
    id: s.id,
    tenantId: s.tenantId,
    title: s.title,
    description: s.description,
    status: s.status,
    assigneeId: s.assigneeId,
    assignedAt: s.assignedAt?.toISOString() ?? null,
    completedAt: s.completedAt?.toISOString() ?? null,
    createdBy: s.createdBy,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}
