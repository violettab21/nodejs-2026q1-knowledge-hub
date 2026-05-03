import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'User login',
    example: 'user1',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  login: string;
  @ApiProperty({
    description: 'User password',
    example: '123456',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  password: string;
  @ApiProperty({
    description: 'User role',
    example: 'admin',
    enum: ['ADMIN', 'EDITOR', 'VIEWER'],
    required: false,
  })
  @IsOptional()
  @IsIn(['ADMIN', 'EDITOR', 'VIEWER'])
  role?: UserRole;
}
