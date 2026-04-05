import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/roles.enum';

export class User {
  id: string;
  login: string;
  password: string;
  role?: UserRole;
  createdAt: number;
  updatedAt: number;
}

export class UserResponse {
  @ApiProperty({
    description: 'User Id (UID)',
    example: 'e30c4ac7-5be6-410a-ac61-c59e3eb5ea4f',
    type: String,
    required: true,
  })
  id: string;
  login: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}
