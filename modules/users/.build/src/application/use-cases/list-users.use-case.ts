import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository';
import type { UserOutput } from '../dtos/user.dto';
import { toOutput } from './to-output';

@Injectable()
export class ListUsersUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  async execute(tenantId: string): Promise<UserOutput[]> {
    const rows = await this.users.listByTenant(tenantId);
    return rows.map(toOutput);
  }
}
