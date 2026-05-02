import { IsDefined, IsOptional, IsString, IsUUID } from 'class-validator';

export class TranslateArticleAiDto {
  @IsDefined()
  @IsString()
  targetLanguage: string;
  @IsOptional()
  sourceLanguage?: string;
}
export class TranslateArticleParams {
  @IsUUID()
  articleId: string;
}
