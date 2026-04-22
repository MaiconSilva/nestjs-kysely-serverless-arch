import { type TenantRepository } from '../../domain/repositories/tenant.repository';
import type { TenantOutput } from '../dtos/create-tenant.input';
export declare class GetTenantUseCase {
    private readonly tenants;
    constructor(tenants: TenantRepository);
    execute(id: string): Promise<TenantOutput>;
}
//# sourceMappingURL=get-tenant.use-case.d.ts.map