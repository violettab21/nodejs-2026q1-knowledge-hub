import { IsOptional, IsUUID } from 'class-validator';

export class SummarizeArticleAiDto {
  @IsOptional()
  maxLength?: 'short' | 'medium' | 'detailed';
}
export class SummarizeArticleParams {
  @IsUUID()
  articleId: string;
}
