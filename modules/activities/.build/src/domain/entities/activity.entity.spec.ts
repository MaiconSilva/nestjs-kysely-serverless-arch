import { randomUUID } from 'crypto';
import { Activity } from './activity.entity';
import {
  ActivityAlreadyAssignedError,
  ActivityAlreadyCompletedError,
  ActivityHasNoAssigneeError,
  InvalidActivityTitleError,
  UserNotBelongsToTenantError,
} from '../errors/activity.errors';

const TENANT_A = randomUUID();
const TENANT_B = randomUUID();
const USER_1 = randomUUID();
const USER_2 = randomUUID();

function makeActivity() {
  return Activity.create({
    tenantId: TENANT_A,
    title: 'Trocar óleo do carro',
    description: 'Serviço 5W30',
    createdBy: USER_1,
  });
}

describe('Activity', () => {
  describe('create', () => {
    it('starts as pending with no assignee', () => {
      const a = makeActivity();
      expect(a.status.isPending()).toBe(true);
      expect(a.assigneeId).toBeNull();
      expect(a.completedAt).toBeNull();
      expect(a.createdBy.value).toBe(USER_1);
    });

    it('trims the title and rejects empty', () => {
      expect(() =>
        Activity.create({ tenantId: TENANT_A, title: '   ', createdBy: USER_1 }),
      ).toThrow(InvalidActivityTitleError);
    });

    it('rejects oversize title', () => {
      expect(() =>
        Activity.create({
          tenantId: TENANT_A,
          title: 'x'.repeat(501),
          createdBy: USER_1,
        }),
      ).toThrow(InvalidActivityTitleError);
    });
  });

  describe('assign', () => {
    it('assigns to a user of the same tenant', () => {
      const a = makeActivity();
      a.assign(USER_2, TENANT_A);
      expect(a.status.isAssigned()).toBe(true);
      expect(a.assigneeId?.value).toBe(USER_2);
      expect(a.assignedAt).not.toBeNull();
    });

    it('rejects assigning a user from another tenant', () => {
      const a = makeActivity();
      expect(() => a.assign(USER_2, TENANT_B)).toThrow(UserNotBelongsToTenantError);
    });

    it('rejects re-assignment', () => {
      const a = makeActivity();
      a.assign(USER_2, TENANT_A);
      expect(() => a.assign(randomUUID(), TENANT_A)).toThrow(ActivityAlreadyAssignedError);
    });
  });

  describe('complete', () => {
    it('completes an assigned activity', () => {
      const a = makeActivity();
      a.assign(USER_2, TENANT_A);
      a.complete();
      expect(a.status.isCompleted()).toBe(true);
      expect(a.completedAt).not.toBeNull();
    });

    it('rejects completion without assignee', () => {
      const a = makeActivity();
      expect(() => a.complete()).toThrow(ActivityHasNoAssigneeError);
    });

    it('rejects double completion', () => {
      const a = makeActivity();
      a.assign(USER_2, TENANT_A);
      a.complete();
      expect(() => a.complete()).toThrow(ActivityAlreadyCompletedError);
    });
  });

  it('round-trips through snapshot', () => {
    const a = makeActivity();
    a.assign(USER_2, TENANT_A);
    const restored = Activity.restore(a.toSnapshot());
    expect(restored.toSnapshot()).toEqual(a.toSnapshot());
  });
});
