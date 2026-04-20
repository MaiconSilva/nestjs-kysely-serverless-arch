import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentTenant, Roles } from '@todolist/shared';
import { CreateUserInput } from '../../application/dtos/user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly listUsers: ListUsersUseCase,
  ) {}

  @Roles('admin')
  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @Body() input: CreateUserInput,
  ) {
    return this.createUser.execute(tenantId, input);
  }

  @Roles('admin')
  @Get()
  list(@CurrentTenant() tenantId: string) {
    return this.listUsers.execute(tenantId);
  }
}
