import type { Selectable } from 'kysely';
import type { UsersTable } from '@todolist/shared';
import { User } from '../../domain/entities/user.entity';
type UserRow = Selectable<UsersTable>;
export declare const UserMapperLike: {
    toDomain(row: UserRow): User;
    toPersistence(user: User): {
        id: string;
        tenant_id: string;
        name: string;
        email: string;
        role: "admin" | "member";
        cognito_sub: string | null;
        active: boolean;
    };
};
export declare const UserMapper: {
    toDomain(row: UserRow): User;
    toPersistence(user: User): {
        id: string;
        tenant_id: string;
        name: string;
        email: string;
        role: "admin" | "member";
        cognito_sub: string | null;
        active: boolean;
    };
};
export {};
//# sourceMappingURL=user.mapper.d.ts.map