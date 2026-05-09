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

const chunkSize = Number(process.env.RAG_CHUNK_SIZE) || 800;
const overlap = Number(process.env.RAG_CHUNK_OVERLAP) || 200;

@Injectable()
export class RagService {
  ai = new GoogleGenAI({});
  constructor(
    private articlesService: ArticlesService,
    private vectorDBService: VectorDBService,
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

  search(searchDto: RagSearchRequestDTO) {
    return `This action search vector`;
  }

  chat(chatDTO: RagChatRequestDTO) {
    return `This action returns a chat result`;
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
