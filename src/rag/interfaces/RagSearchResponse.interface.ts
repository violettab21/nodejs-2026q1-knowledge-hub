export interface RagSearchResponse {
  results: Result[];
}

export interface Result {
  articleId: string;
  articleTitle: string;
  chunk: string;
  similarity: number;
}
