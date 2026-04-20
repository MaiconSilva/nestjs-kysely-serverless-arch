import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '@todolist/shared';
import { CreateTenantInput } from '../../application/dtos/create-tenant.input';
import { CreateTenantUseCase } from '../../application/use-cases/create-tenant.use-case';
import { GetTenantUseCase } from '../../application/use-cases/get-tenant.use-case';

@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly createTenant: CreateTenantUseCase,
    private readonly getTenant: GetTenantUseCase,
  ) {}

  // Tenant signup is intentionally public — the caller doesn't yet belong anywhere.
  @Public()
  @Post()
  create(@Body() input: CreateTenantInput) {
    return this.createTenant.execute(input);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.getTenant.execute(id);
  }
}
