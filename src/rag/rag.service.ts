import { Injectable } from '@nestjs/common';
import { ReindexRequestDTO } from './dto/reindex-request.dto';
import { RagSearchRequestDTO } from './dto/search.dto';
import { RagChatRequestDTO } from './dto/rag-chat-request.dto';
import { GoogleGenAI } from '@google/genai';
import { ArticlesService } from 'src/articles/articles.service';
import { ArticleStatus } from 'generated/prisma/enums';
import { COLLECTION_NAME_ARTICLES, VectorDBService } from './vectorDB.service';
import { randomUUID } from 'node:crypto';
import { getChunks } from './utils/chunkContent';
import 'dotenv/config';
import { generatePrompt } from './prompts/prompts';
import { ChatHistoryService } from './chatHistory.service';

const chunkSize = Number(process.env.RAG_CHUNK_SIZE) || 800;
const overlap = Number(process.env.RAG_CHUNK_OVERLAP) || 200;
const model = process.env.GEMINI_MODEL;

@Injectable()
export class RagService {
  ai = new GoogleGenAI({});
  constructor(
    private articlesService: ArticlesService,
    private vectorDBService: VectorDBService,
    private chatStorage: ChatHistoryService,
  ) {}
  async buildVector(reindexDTO: ReindexRequestDTO) {
    const onlyPublished = reindexDTO.onlyPublished ?? true;
    const articleList = reindexDTO.articleIds;
    const status = onlyPublished ? ArticleStatus.PUBLISHED : undefined;
    const allArticles = (await this.articlesService.findAll(status)) as {
      tags: string[];
      createdAt: number;
      updatedAt: number;
      id: string;
      title: string;
      content: string;
      authorId: string | null;
      categoryId: string | null;
      status: ArticleStatus;
    }[];
    let articlesToIndex = allArticles;
    if (articleList) {
      articlesToIndex = allArticles.filter((article) =>
        articleList.includes(article.id),
      );
    }
    const articlesWithVectorsInChunks = await Promise.all(
      articlesToIndex.map(async (article) => {
        const chunks = getChunks(article.content, chunkSize, overlap);
        const chunksWithVectors = await Promise.all(
          chunks.map(async (chunk) => {
            const vector = await this.buildEmbedding(chunk);
            return {
              id: randomUUID(),
              vector: vector.values,
              payload: { ...article, chunk: chunk },
            };
          }),
        );
        /*const vector = await this.buildEmbedding(article.content);
        console.log('vector', vector);*/
        return chunksWithVectors;
      }),
    );
    const chunksIndexed = articlesWithVectorsInChunks.flat();
    await this.vectorDBService.addArticleIndex(chunksIndexed);

    console.log(articlesToIndex);

    return {
      indexedArticles: articlesWithVectorsInChunks.length,
      indexedChunks: chunksIndexed.length,
      vectorCollection: COLLECTION_NAME_ARTICLES,
    };
  }

  async search(searchDto: RagSearchRequestDTO) {
    const { query, limit = 5, ...rest } = searchDto;
    const queryVector = await this.buildEmbedding(query);
    const searchRes = await this.vectorDBService.searchByQuery(
      queryVector.values,
      limit,
      rest,
    );
    const results = searchRes.map((record) => {
      return {
        articleId: record.payload.id,
        articleTitle: record.payload.title,
        chunk: record.payload.chunk,
        similarity: record.score,
      };
    });
    return {
      results: results,
    };
  }

  async chat(chatDTO: RagChatRequestDTO) {
    const { question, conversationId } = chatDTO;
    const isChatExist = this.chatStorage.isChatExist(conversationId);
    let history = [];
    let chatId: string;
    if (isChatExist) {
      chatId = conversationId;
      history = this.chatStorage.getChatById(chatId).history;
    }
    const chat = this.ai.chats.create({
      model: model,
      history: history,
    });

    const contextData = await this.search({ query: question });
    const chunks = contextData.results.map((result) => result.chunk);
    const sources = contextData.results.map((result) => {
      return {
        articleId: result.articleId,
        articleTitle: result.articleTitle,
        relevantChunk: result.chunk,
      };
    });

    const answer = await chat.sendMessage({
      message: generatePrompt(question, chunks.join('/n')),
    });

    const historyData = chat.getHistory();

    if (!isChatExist) {
      chatId = randomUUID();
      this.chatStorage.saveChatHistory(chatId, historyData);
    } else {
      this.chatStorage.updateChatHistory(conversationId, historyData);
    }
    const response = {
      answer: answer.candidates[0].content.parts[0].text,
      sources: sources,
      conversationId: chatId,
    };
    return response;
  }

  getChatHistory(conversationId: string) {
    const chat = this.chatStorage.getChatById(conversationId);
    if (!chat) {
      return null;
    }
    return chat.history;
  }

  async buildEmbedding(data: string) {
    const result = await this.ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: data,
      config: { taskType: 'RETRIEVAL_DOCUMENT' },
    });

    return result.embeddings[0];
  }
}
