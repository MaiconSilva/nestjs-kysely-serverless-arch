import { randomUUID } from 'crypto';
import { CompleteActivityUseCase } from './complete-activity.use-case';
import { Activity } from '../../domain/entities/activity.entity';
import {
  ActivityHasNoAssigneeError,
  ActivityNotFoundError,
} from '../../domain/errors/activity.errors';
import type { ActivityRepository } from '../../domain/repositories/activity.repository';

function makeRepo(initial: Activity[] = []): ActivityRepository {
  const store = new Map(initial.map((a) => [a.id.value, a]));
  return {
    async findById(_t, id) {
      return store.get(id) ?? null;
    },
    async listByTenant() {
      return [...store.values()];
    },
    async findActiveByAssignee() {
      return null;
    },
    async save(a) {
      store.set(a.id.value, a);
    },
  };
}

describe('CompleteActivityUseCase', () => {
  const tenant = randomUUID();
  const creator = randomUUID();
  const assignee = randomUUID();

  it('completes an assigned activity', async () => {
    const a = Activity.create({ tenantId: tenant, title: 't', createdBy: creator });
    a.assign(assignee, tenant);
    const repo = makeRepo([a]);
    const uc = new CompleteActivityUseCase(repo);
    const out = await uc.execute(tenant, a.id.value);
    expect(out.status).toBe('completed');
    expect(out.completedAt).not.toBeNull();
  });

  it('fails with 422 when no assignee', async () => {
    const a = Activity.create({ tenantId: tenant, title: 't', createdBy: creator });
    const uc = new CompleteActivityUseCase(makeRepo([a]));
    await expect(uc.execute(tenant, a.id.value)).rejects.toBeInstanceOf(
      ActivityHasNoAssigneeError,
    );
  });

  it('fails with 404 when activity missing', async () => {
    const uc = new CompleteActivityUseCase(makeRepo());
    await expect(uc.execute(tenant, randomUUID())).rejects.toBeInstanceOf(
      ActivityNotFoundError,
    );
  });
});
