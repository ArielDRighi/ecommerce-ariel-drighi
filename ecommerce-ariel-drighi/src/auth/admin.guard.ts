import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../users/enum/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      !user ||
      !requiredRoles ||
      !requiredRoles.includes(user.administrator)
    ) {
      throw new ForbiddenException(
        'No cuentas con los permisos necesarios para acceder a esta ruta.',
      );
    }

    return true;
  }
}
