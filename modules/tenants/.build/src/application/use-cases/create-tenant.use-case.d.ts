import { type TenantRepository } from '../../domain/repositories/tenant.repository';
import type { CreateTenantInput, TenantOutput } from '../dtos/create-tenant.input';
export declare class CreateTenantUseCase {
    private readonly tenants;
    constructor(tenants: TenantRepository);
    execute(input: CreateTenantInput): Promise<TenantOutput>;
}
//# sourceMappingURL=create-tenant.use-case.d.ts.map