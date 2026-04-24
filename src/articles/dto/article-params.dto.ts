import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { sortBy } from '../constants/constants';
import { ArticleStatus } from '../../../generated/prisma/enums';

export class ArticleParams {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  id: string;
}

export class ArticleQueryParams {
  @ApiProperty({
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    required: false,
  })
  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: ArticleStatus;
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  tag?: string;

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

  @IsOptional()
  @IsString()
  @IsIn(sortBy)
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
