import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthenticatedClaims } from '../../infrastructure/auth/jwt-verifier';

export const CurrentUser = createParamDecorator<
  keyof AuthenticatedClaims | undefined,
  ExecutionContext
>((field, ctx) => {
  const req = ctx.switchToHttp().getRequest<{ user?: AuthenticatedClaims }>();
  if (!req.user) return undefined;
  return field ? req.user[field] : req.user;
});
