import { Inject, Injectable } from '@nestjs/common';
import { TenantNotFoundError } from '../../domain/errors/tenant.errors';
import {
  TENANT_REPOSITORY,
  type TenantRepository,
} from '../../domain/repositories/tenant.repository';
import type { TenantOutput } from '../dtos/create-tenant.input';
import { toOutput } from './to-output';

@Injectable()
export class GetTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY) private readonly tenants: TenantRepository,
  ) {}

  async execute(id: string): Promise<TenantOutput> {
    const tenant = await this.tenants.findById(id);
    if (!tenant) throw new TenantNotFoundError(id);
    return toOutput(tenant);
  }
}
