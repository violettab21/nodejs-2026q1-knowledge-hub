import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  name: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  description: string;
}
