export declare class CreateUserInput {
    name: string;
    email: string;
    role?: 'admin' | 'member';
    temporaryPassword: string;
}
export declare class LoginInput {
    email: string;
    password: string;
}
export interface UserOutput {
    id: string;
    tenantId: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    active: boolean;
    createdAt: string;
}
export interface LoginOutput {
    accessToken: string;
    idToken?: string;
    refreshToken?: string;
    expiresIn: number;
    user: Pick<UserOutput, 'id' | 'tenantId' | 'email' | 'role' | 'name'>;
}
//# sourceMappingURL=user.dto.d.ts.map