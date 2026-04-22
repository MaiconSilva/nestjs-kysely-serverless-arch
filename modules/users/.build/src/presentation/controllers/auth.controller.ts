import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from '@todolist/shared';
import { LoginInput } from '../../application/dtos/user.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly login: LoginUseCase) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  doLogin(@Body() input: LoginInput) {
    return this.login.execute(input);
  }
}
