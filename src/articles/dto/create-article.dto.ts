import {
  IsArray,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateArticleDto {
  @IsDefined()
  title: string;
  @IsDefined()
  content: string;
  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';
  @IsOptional()
  @IsUUID()
  authorId: string | null;
  @IsOptional()
  @IsUUID()
  categoryId: string | null;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
