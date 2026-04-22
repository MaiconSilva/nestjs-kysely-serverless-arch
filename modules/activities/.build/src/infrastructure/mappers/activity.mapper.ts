import type { Insertable, Selectable } from 'kysely';
import type { ActivitiesTable } from '@todolist/shared';
import { Activity } from '../../domain/entities/activity.entity';

type Row = Selectable<ActivitiesTable>;

function toDateOrNull(v: unknown): Date | null {
  if (v == null) return null;
  return v instanceof Date ? v : new Date(String(v));
}

function toDate(v: unknown): Date {
  return v instanceof Date ? v : new Date(String(v));
}

export const ActivityMapper = {
  toDomain(row: Row): Activity {
    return Activity.restore({
      id: row.id,
      tenantId: row.tenant_id,
      title: row.title,
      description: row.description,
      status: row.status,
      assigneeId: row.assignee_id,
      assignedAt: toDateOrNull(row.assigned_at),
      completedAt: toDateOrNull(row.completed_at),
      createdBy: row.created_by,
      createdAt: toDate(row.created_at),
      updatedAt: toDate(row.updated_at),
    });
  },

  toPersistence(a: Activity): Insertable<ActivitiesTable> {
    const s = a.toSnapshot();
    return {
      id: s.id,
      tenant_id: s.tenantId,
      title: s.title,
      description: s.description,
      status: s.status,
      assignee_id: s.assigneeId,
      assigned_at: s.assignedAt,
      completed_at: s.completedAt,
      created_by: s.createdBy,
      created_at: s.createdAt,
      updated_at: s.updatedAt,
    } as unknown as Insertable<ActivitiesTable>;
  },
};
