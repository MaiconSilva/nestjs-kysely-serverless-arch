import { Module, type Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, KyselyModule, RoleGuard } from '@todolist/shared';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { USER_REPOSITORY } from '../domain/repositories/user.repository';
import { IDENTITY_PROVIDER } from '../domain/services/identity-provider';
import { CognitoUserService } from '../infrastructure/cognito/cognito-user.service';
import { LocalIdentityService } from '../infrastructure/cognito/local-identity.service';
import { UserKyselyRepository } from '../infrastructure/repositories/user.kysely.repository';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';

const identityProvider: Provider = {
  provide: IDENTITY_PROVIDER,
  useFactory: () => {
    const mode = process.env.AUTH_MODE ?? (process.env.COGNITO_USER_POOL_ID ? 'cognito' : 'local');
    if (mode === 'cognito') return new CognitoUserService();
    return new LocalIdentityService();
  },
};

@Module({
  imports: [KyselyModule],
  controllers: [AuthController, UsersController],
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    LoginUseCase,
    { provide: USER_REPOSITORY, useClass: UserKyselyRepository },
    identityProvider,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class UsersModule {}
