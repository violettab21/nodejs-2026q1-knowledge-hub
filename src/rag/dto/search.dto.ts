import {
  IsArray,
  IsDefined,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class RagSearchRequestDTO {
  @IsDefined()
  @IsString()
  query: string; // required
  @IsOptional()
  @IsInt()
  limit?: number; // optional, default 5, max 20
  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  articleStatus?: 'draft' | 'published' | 'archived'; // optional filter
  @IsOptional()
  @IsString()
  categoryId?: string; // optional filter
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]; // optional filter
}
