import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginDTO {
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
}
