import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { EmailAlreadyExistsError } from '../../domain/errors/user.errors';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository';
import {
  IDENTITY_PROVIDER,
  type IdentityProvider,
} from '../../domain/services/identity-provider';
import type { CreateUserInput, UserOutput } from '../dtos/user.dto';
import { toOutput } from './to-output';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider,
  ) {}

  async execute(tenantId: string, input: CreateUserInput): Promise<UserOutput> {
    const emailNormalized = input.email.trim().toLowerCase();
    const existing = await this.users.findByEmailInTenant(tenantId, emailNormalized);
    if (existing) throw new EmailAlreadyExistsError(emailNormalized);

    const role = input.role ?? 'member';
    // Create in Cognito first so, if it fails, we don't end up with a dangling DB row.
    const { sub } = await this.identity.createUser({
      email: emailNormalized,
      temporaryPassword: input.temporaryPassword,
      tenantId,
      role,
      name: input.name,
    });

    const user = User.create({
      tenantId,
      name: input.name,
      email: emailNormalized,
      role,
      cognitoSub: sub,
    });
    await this.users.save(user);
    return toOutput(user);
  }
}
