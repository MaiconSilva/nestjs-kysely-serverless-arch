import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/entities/tenant.entity';
import { TenantSlugAlreadyExistsError } from '../../domain/errors/tenant.errors';
import {
  TENANT_REPOSITORY,
  type TenantRepository,
} from '../../domain/repositories/tenant.repository';
import type { CreateTenantInput, TenantOutput } from '../dtos/create-tenant.input';
import { toOutput } from './to-output';

@Injectable()
export class CreateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY) private readonly tenants: TenantRepository,
  ) {}

  async execute(input: CreateTenantInput): Promise<TenantOutput> {
    const existing = await this.tenants.findBySlug(input.slug.trim().toLowerCase());
    if (existing) {
      throw new TenantSlugAlreadyExistsError(input.slug);
    }
    const tenant = Tenant.create({ name: input.name, slug: input.slug });
    await this.tenants.save(tenant);
    return toOutput(tenant);
  }
}
