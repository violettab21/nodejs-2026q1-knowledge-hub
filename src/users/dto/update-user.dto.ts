import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsDefined()
  oldPassword: string;
  @ApiProperty()
  @IsDefined()
  newPassword: string;
}
