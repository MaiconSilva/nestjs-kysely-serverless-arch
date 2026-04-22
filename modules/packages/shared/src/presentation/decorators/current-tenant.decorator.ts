import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthenticatedClaims } from '../../infrastructure/auth/jwt-verifier';

export const CurrentTenant = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<{ user?: AuthenticatedClaims }>();
  return req.user?.tenantId;
});
