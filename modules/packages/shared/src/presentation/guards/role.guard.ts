import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, type Role } from '../decorators/roles.decorator';
import type { AuthenticatedClaims } from '../../infrastructure/auth/jwt-verifier';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest<{ user?: AuthenticatedClaims }>();
    const user = req.user;
    if (!user) throw new ForbiddenException('User is not authenticated');
    if (!required.includes(user.role)) {
      throw new ForbiddenException(
        `Role '${user.role}' is not allowed (requires: ${required.join(', ')})`,
      );
    }
    return true;
  }
}
