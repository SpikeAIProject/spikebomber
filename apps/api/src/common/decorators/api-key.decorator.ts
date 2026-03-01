import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Roles decorator - use with RolesGuard to restrict access by user role
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Current user decorator - extracts user from request
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: Record<string, unknown> }>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

/**
 * API Key decorator - marks endpoint as API key authenticated
 */
export const ApiKeyAuth = () => SetMetadata('api-key-auth', true);
