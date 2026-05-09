import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { QdrantClient } from '@qdrant/js-client-rest';
/*import { Article } from 'generated/prisma/client';*/

export const COLLECTION_NAME_ARTICLES = 'articles_vectors';

interface ArticlePoint {
  id: string;
  vector: number[];
  payload: any;
}

/*interface Payload extends Article {
  chunk: string;
}*/

interface Filter {
  articleStatus?: 'draft' | 'published' | 'archived';
  categoryId?: string;
  tags?: string[];
}

@Injectable()
export class VectorDBService {
  private readonly client: QdrantClient;
  constructor() {
    this.client = new QdrantClient({ host: 'localhost', port: 6333 });
    void this.createCollection(COLLECTION_NAME_ARTICLES);
  }

  async createCollection(collectionName: string) {
    const isExist = await this.client.collectionExists(
      COLLECTION_NAME_ARTICLES,
    );
    if (!isExist.exists) {
      await this.client.createCollection(collectionName, {
        vectors: { size: 3072, distance: 'Cosine' },
      });
    }
  }

  async addArticleIndex(articlePoints: ArticlePoint[]) {
    await this.client.upsert(COLLECTION_NAME_ARTICLES, {
      points: articlePoints,
    });
  }

  async searchByQuery(query: number[], limit: number = 5, filter: Filter) {
    const filters = [];
    if (filter.articleStatus) {
      filters.push({
        key: 'status',
        match: { value: filter.articleStatus.toUpperCase() },
      });
    }
    if (filter.categoryId) {
      filters.push({ key: 'categoryId', match: { value: filter.categoryId } });
    }
    if (filter.tags) {
      filters.push({ key: 'tags', match: { any: filter.tags } });
    }
    const result = await this.client.query(COLLECTION_NAME_ARTICLES, {
      query,
      filter: { must: filters },
      limit,
      with_payload: true,
    });
    const searchResult = result.points;
    return searchResult;
  }
}
