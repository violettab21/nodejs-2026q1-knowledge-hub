import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class AnalyzeArticleAiDto {
  @IsOptional()
  @IsIn(['review', 'bugs', 'optimize', 'explain'])
  task?: 'review' | 'bugs' | 'optimize' | 'explain';
}
export class AnalyzeArticleParams {
  @IsUUID()
  articleId: string;
}
