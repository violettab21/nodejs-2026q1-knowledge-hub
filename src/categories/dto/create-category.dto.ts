import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDefined()
  name: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDefined()
  description: string;
}
