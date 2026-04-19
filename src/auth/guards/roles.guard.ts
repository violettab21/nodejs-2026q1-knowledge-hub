import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'generated/prisma/enums';
import { ROLES } from '../auth.roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>(ROLES, context.getHandler());
    if (roles) {
      const req = context.switchToHttp().getRequest();
      const user = req.user;
      if (roles.some((value) => value === user.role)) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
