import { CreateTenantInput } from '../../application/dtos/create-tenant.input';
import { CreateTenantUseCase } from '../../application/use-cases/create-tenant.use-case';
import { GetTenantUseCase } from '../../application/use-cases/get-tenant.use-case';
export declare class TenantsController {
    private readonly createTenant;
    private readonly getTenant;
    constructor(createTenant: CreateTenantUseCase, getTenant: GetTenantUseCase);
    create(input: CreateTenantInput): Promise<import("../../application/dtos/create-tenant.input").TenantOutput>;
    find(id: string): Promise<import("../../application/dtos/create-tenant.input").TenantOutput>;
}
//# sourceMappingURL=tenants.controller.d.ts.map