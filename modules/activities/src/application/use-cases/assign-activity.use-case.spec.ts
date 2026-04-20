import { randomUUID } from 'crypto';
import { AssignActivityUseCase } from './assign-activity.use-case';
import { Activity } from '../../domain/entities/activity.entity';
import {
  ActivityNotFoundError,
  UserAlreadyHasActivityError,
  UserNotBelongsToTenantError,
} from '../../domain/errors/activity.errors';
import type { ActivityRepository } from '../../domain/repositories/activity.repository';
import type { UserLookup } from '../../domain/services/user-lookup';

function makeRepo(initial: Activity[] = []): ActivityRepository {
  const store = new Map<string, Activity>(initial.map((a) => [a.id.value, a]));
  return {
    async findById(_t, id) {
      return store.get(id) ?? null;
    },
    async listByTenant(tenantId) {
      return [...store.values()].filter((a) => a.tenantId.value === tenantId);
    },
    async findActiveByAssignee(tenantId, userId) {
      return (
        [...store.values()].find(
          (a) =>
            a.tenantId.value === tenantId &&
            a.assigneeId?.value === userId &&
            !a.status.isCompleted(),
        ) ?? null
      );
    },
    async save(a) {
      store.set(a.id.value, a);
    },
  };
}

function makeUserLookup(tenantOfUser: Record<string, string>): UserLookup {
  return {
    async findTenantOfUser(_tenantId, userId) {
      return tenantOfUser[userId] ?? null;
    },
    async findUserIdBySub() {
      return null;
    },
  };
}

describe('AssignActivityUseCase', () => {
  const tenantA = randomUUID();
  const tenantB = randomUUID();
  const creator = randomUUID();
  const assignee = randomUUID();

  it('assigns when user belongs to the same tenant', async () => {
    const activity = Activity.create({ tenantId: tenantA, title: 't', createdBy: creator });
    const repo = makeRepo([activity]);
    const uc = new AssignActivityUseCase(repo, makeUserLookup({ [assignee]: tenantA }));
    const out = await uc.execute(tenantA, activity.id.value, { userId: assignee });
    expect(out.status).toBe('assigned');
    expect(out.assigneeId).toBe(assignee);
  });

  it('returns 404 when activity does not exist', async () => {
    const repo = makeRepo();
    const uc = new AssignActivityUseCase(repo, makeUserLookup({ [assignee]: tenantA }));
    await expect(
      uc.execute(tenantA, randomUUID(), { userId: assignee }),
    ).rejects.toBeInstanceOf(ActivityNotFoundError);
  });

  it('rejects when target user is in another tenant', async () => {
    const activity = Activity.create({ tenantId: tenantA, title: 't', createdBy: creator });
    const repo = makeRepo([activity]);
    const uc = new AssignActivityUseCase(repo, makeUserLookup({ [assignee]: tenantB }));
    await expect(
      uc.execute(tenantA, activity.id.value, { userId: assignee }),
    ).rejects.toBeInstanceOf(UserNotBelongsToTenantError);
  });

  it('rejects when assignee already has another active activity', async () => {
    const busy = Activity.create({ tenantId: tenantA, title: 'busy', createdBy: creator });
    busy.assign(assignee, tenantA);
    const target = Activity.create({ tenantId: tenantA, title: 'target', createdBy: creator });
    const repo = makeRepo([busy, target]);
    const uc = new AssignActivityUseCase(repo, makeUserLookup({ [assignee]: tenantA }));
    await expect(
      uc.execute(tenantA, target.id.value, { userId: assignee }),
    ).rejects.toBeInstanceOf(UserAlreadyHasActivityError);
  });
});
