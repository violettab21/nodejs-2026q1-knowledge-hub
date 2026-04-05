import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  oldPassword: string;
  @ApiProperty()
  @IsDefined()
  @IsString()
  newPassword: string;
}
