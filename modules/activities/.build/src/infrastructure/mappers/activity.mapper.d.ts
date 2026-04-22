import type { Insertable, Selectable } from 'kysely';
import type { ActivitiesTable } from '@todolist/shared';
import { Activity } from '../../domain/entities/activity.entity';
type Row = Selectable<ActivitiesTable>;
export declare const ActivityMapper: {
    toDomain(row: Row): Activity;
    toPersistence(a: Activity): Insertable<ActivitiesTable>;
};
export {};
//# sourceMappingURL=activity.mapper.d.ts.map