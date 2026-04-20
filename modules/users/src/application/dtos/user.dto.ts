import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserInput {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsIn(['admin', 'member'])
  role?: 'admin' | 'member';

  @IsString()
  @Length(8, 128)
  temporaryPassword!: string;
}

export class LoginInput {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(1, 128)
  password!: string;
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
