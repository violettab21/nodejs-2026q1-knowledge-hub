import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ReindexRequestDTO {
  @IsOptional()
  @IsBoolean()
  onlyPublished?: boolean;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  articleIds?: string[];
}

export class IndexParamsDTO {
  @IsUUID()
  articleId: string;
}
