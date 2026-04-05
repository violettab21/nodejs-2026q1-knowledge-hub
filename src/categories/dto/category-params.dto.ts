import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CategoryParams {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  id: string;
}

export class CategoryQueryParams {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
