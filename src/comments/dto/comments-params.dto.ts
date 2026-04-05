import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CommentsParams {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  id: string;
}

export class CommentsQueryParams {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  articleId: string;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
