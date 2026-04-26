import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';

export const ROLES = 'Roles';
export const Roles = (roles: UserRole[]) => SetMetadata(ROLES, roles);
