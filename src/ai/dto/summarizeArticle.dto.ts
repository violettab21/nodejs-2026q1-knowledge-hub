import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { Size } from '../interfaces/summarizeArticle.interface';

export class SummarizeArticleAiDto {
  @IsOptional()
  @IsIn(['short', 'medium', 'detailed'])
  maxLength?: Size;
}
export class SummarizeArticleParams {
  @IsUUID()
  articleId: string;
}
