import { randomUUID } from 'crypto';
import { User } from './user.entity';
import { InvalidEmailError } from '@todolist/shared';

const TENANT = randomUUID();

describe('User', () => {
  it('defaults to member role and active=true', () => {
    const u = User.create({ tenantId: TENANT, name: 'Alice', email: 'a@b.com' });
    expect(u.role.value).toBe('member');
    expect(u.active).toBe(true);
  });

  it('creates as admin when role provided', () => {
    const u = User.create({
      tenantId: TENANT,
      name: 'Alice',
      email: 'a@b.com',
      role: 'admin',
    });
    expect(u.role.isAdmin()).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(() =>
      User.create({ tenantId: TENANT, name: 'Alice', email: 'not-an-email' }),
    ).toThrow(InvalidEmailError);
  });

  it('links Cognito sub', () => {
    const u = User.create({ tenantId: TENANT, name: 'Alice', email: 'a@b.com' });
    expect(u.cognitoSub).toBeNull();
    u.linkCognitoSub('sub-123');
    expect(u.cognitoSub).toBe('sub-123');
  });

  it('promotes to admin', () => {
    const u = User.create({ tenantId: TENANT, name: 'Alice', email: 'a@b.com' });
    u.promoteToAdmin();
    expect(u.role.isAdmin()).toBe(true);
  });
});
