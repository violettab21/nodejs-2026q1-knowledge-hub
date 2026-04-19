import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';

@Injectable()
export class PermissionsUsersGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const userId = req.params?.id;
    if (user.role === UserRole.EDITOR && req.method !== 'GET') {
      if (userId) {
        if (userId !== user.userId) {
          return false;
        }
      }
    }
    return true;
  }
}
