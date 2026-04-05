import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({
    type: String,
    required: true,
  })
  id: string;
  name: string;
  description: string;
}
