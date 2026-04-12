import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ArticleStatus } from 'generated/prisma/enums';

export class CreateArticleDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  title: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  content: string;
  @ApiProperty({
    type: String,
    required: false,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
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
  authorId: string | null;
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId: string | null;
  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
