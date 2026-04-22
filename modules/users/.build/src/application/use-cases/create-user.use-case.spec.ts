import { randomUUID } from 'crypto';
import { CreateUserUseCase } from './create-user.use-case';
import { EmailAlreadyExistsError } from '../../domain/errors/user.errors';
import type { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { IdentityProvider } from '../../domain/services/identity-provider';

function fakeRepo(initial: User[] = []): UserRepository & { saved: User[] } {
  const saved: User[] = [...initial];
  return {
    saved,
    async findByEmailInTenant(tenantId, email) {
      return (
        saved.find((u) => u.tenantId.value === tenantId && u.email.value === email) ?? null
      );
    },
    async findByIdInTenant(tenantId, id) {
      return saved.find((u) => u.tenantId.value === tenantId && u.id.value === id) ?? null;
    },
    async findByCognitoSub(sub) {
      return saved.find((u) => u.cognitoSub === sub) ?? null;
    },
    async listByTenant(tenantId) {
      return saved.filter((u) => u.tenantId.value === tenantId);
    },
    async save(user) {
      saved.push(user);
    },
  };
}

function fakeIdentity(): IdentityProvider & { createCalled: number } {
  const state = { createCalled: 0 };
  return {
    get createCalled() {
      return state.createCalled;
    },
    async createUser() {
      state.createCalled++;
      return { sub: randomUUID() };
    },
    async authenticate() {
      throw new Error('not used');
    },
  };
}

describe('CreateUserUseCase', () => {
  const tenant = randomUUID();

  it('creates user in Cognito and persists in tenant', async () => {
    const repo = fakeRepo();
    const identity = fakeIdentity();
    const uc = new CreateUserUseCase(repo, identity);

    const out = await uc.execute(tenant, {
      name: 'Alice',
      email: 'alice@example.com',
      role: 'admin',
      temporaryPassword: 'Temp1234',
    });
    expect(identity.createCalled).toBe(1);
    expect(out.email).toBe('alice@example.com');
    expect(repo.saved).toHaveLength(1);
  });

  it('rejects duplicate email in same tenant', async () => {
    const repo = fakeRepo();
    const identity = fakeIdentity();
    const uc = new CreateUserUseCase(repo, identity);
    await uc.execute(tenant, {
      name: 'Alice',
      email: 'alice@example.com',
      role: 'admin',
      temporaryPassword: 'Temp1234',
    });
    await expect(
      uc.execute(tenant, {
        name: 'Alice 2',
        email: 'ALICE@example.com',
        role: 'member',
        temporaryPassword: 'Temp1234',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
    expect(identity.createCalled).toBe(1);
  });
});
