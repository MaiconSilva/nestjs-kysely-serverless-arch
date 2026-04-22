import { Kysely } from 'kysely';
import { type DB } from '@todolist/shared';
import { type IdentityProvider } from '../../domain/services/identity-provider';
import type { LoginInput, LoginOutput } from '../dtos/user.dto';
export declare class LoginUseCase {
    private readonly identity;
    private readonly db;
    constructor(identity: IdentityProvider, db: Kysely<DB>);
    execute(input: LoginInput): Promise<LoginOutput>;
}
//# sourceMappingURL=login.use-case.d.ts.map