import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, KyselyModule, RoleGuard } from '@todolist/shared';
import { CreateTenantUseCase } from '../application/use-cases/create-tenant.use-case';
import { GetTenantUseCase } from '../application/use-cases/get-tenant.use-case';
import { TENANT_REPOSITORY } from '../domain/repositories/tenant.repository';
import { TenantKyselyRepository } from '../infrastructure/repositories/tenant.kysely.repository';
import { TenantsController } from './controllers/tenants.controller';

@Module({
  imports: [KyselyModule],
  controllers: [TenantsController],
  providers: [
    CreateTenantUseCase,
    GetTenantUseCase,
    { provide: TENANT_REPOSITORY, useClass: TenantKyselyRepository },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class TenantsModule {}
