import type { Selectable } from 'kysely';
import type { ActivitiesTable } from '@todolist/shared';
import { Activity } from '../../domain/entities/activity.entity';

type Row = Selectable<ActivitiesTable>;

export const ActivityMapper = {
  toDomain(row: Row): Activity {
    return Activity.restore({
      id: row.id,
      tenantId: row.tenant_id,
      title: row.title,
      description: row.description,
      status: row.status,
      assigneeId: row.assignee_id,
      assignedAt: row.assigned_at ? new Date(row.assigned_at as unknown as string) : null,
      completedAt: row.completed_at ? new Date(row.completed_at as unknown as string) : null,
      createdBy: row.created_by,
      createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
      updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at),
    });
  },

  toPersistence(a: Activity): {
    id: string;
    tenant_id: string;
    title: string;
    description: string | null;
    status: 'pending' | 'assigned' | 'completed';
    assignee_id: string | null;
    assigned_at: Date | null;
    completed_at: Date | null;
    created_by: string;
    created_at: Date;
    updated_at: Date;
  } {
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
    };
  },
};
