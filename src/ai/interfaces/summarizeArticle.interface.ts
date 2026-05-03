export type Size = 'short' | 'medium' | 'detailed';

export interface SummarizeArticleResponse {
  articleId: string;
  summary: string;
  originalLength: number;
  summaryLength: number;
}
