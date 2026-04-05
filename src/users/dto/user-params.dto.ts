import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserParams {
  @ApiProperty()
  @IsUUID()
  id: string;
}
