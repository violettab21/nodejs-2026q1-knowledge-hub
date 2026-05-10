export interface RagChatResponse {
  answer: string;
  sources: Source[];
  conversationId: string;
}

export interface Source {
  articleId: string;
  articleTitle: string;
  relevantChunk: string;
}
