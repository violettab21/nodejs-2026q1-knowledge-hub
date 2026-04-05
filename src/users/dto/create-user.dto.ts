import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn, IsOptional } from 'class-validator';
import { UserRole } from '../enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'User login',
    example: 'user1',
    type: String,
    required: true,
  })
  @IsDefined()
  login: string;
  @ApiProperty({
    description: 'User password',
    example: '123456',
    type: String,
    required: true,
  })
  @IsDefined()
  password: string;
  @ApiProperty({
    description: 'User role',
    example: 'admin',
    enum: ['admin', 'editor', 'viewer'],
    required: false,
  })
  @IsOptional()
  @IsIn(['admin', 'editor', 'viewer'])
  role?: UserRole;
}
