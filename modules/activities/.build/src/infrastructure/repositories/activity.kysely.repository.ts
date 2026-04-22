import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY, withTenant, type DB } from '@todolist/shared';
import type { Activity } from '../../domain/entities/activity.entity';
import type {
  ActivityListFilter,
  ActivityRepository,
} from '../../domain/repositories/activity.repository';
import { ActivityMapper } from '../mappers/activity.mapper';

@Injectable()
export class ActivityKyselyRepository implements ActivityRepository {
  constructor(@Inject(KYSELY) private readonly db: Kysely<DB>) {}

  async findById(tenantId: string, id: string): Promise<Activity | null> {
    const row = await withTenant(this.db, tenantId, (trx) =>
      trx.selectFrom('activities').selectAll().where('id', '=', id).executeTakeFirst(),
    );
    return row ? ActivityMapper.toDomain(row) : null;
  }

  async listByTenant(tenantId: string, filter: ActivityListFilter = {}): Promise<Activity[]> {
    const rows = await withTenant(this.db, tenantId, (trx) => {
      let q = trx.selectFrom('activities').selectAll();
      if (filter.status) q = q.where('status', '=', filter.status);
      if (filter.assigneeId) q = q.where('assignee_id', '=', filter.assigneeId);
      return q.orderBy('created_at', 'desc').execute();
    });
    return rows.map(ActivityMapper.toDomain);
  }

  /**
   * Finds the (at most one) active activity a user currently holds. Used by
   * `AssignActivityUseCase` to enforce "one activity per user". The partial
   * unique index `idx_activities_one_active_per_user` in the schema is the
   * database-level safety net.
   */
  async findActiveByAssignee(tenantId: string, userId: string): Promise<Activity | null> {
    const row = await withTenant(this.db, tenantId, (trx) =>
      trx
        .selectFrom('activities')
        .selectAll()
        .where('assignee_id', '=', userId)
        .where('status', '!=', 'completed')
        .limit(1)
        .executeTakeFirst(),
    );
    return row ? ActivityMapper.toDomain(row) : null;
  }

  async save(activity: Activity): Promise<void> {
    const values = ActivityMapper.toPersistence(activity);
    await withTenant(this.db, values.tenant_id, (trx) =>
      trx
        .insertInto('activities')
        .values(values)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            title: values.title,
            description: values.description,
            status: values.status,
            assignee_id: values.assignee_id,
            assigned_at: values.assigned_at,
            completed_at: values.completed_at,
            updated_at: values.updated_at as unknown as Date,
          }),
        )
        .execute(),
    );
  }
}
