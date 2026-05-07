import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { QdrantClient } from '@qdrant/js-client-rest';

export const COLLECTION_NAME_ARTICLES = 'articles_vectors';

interface ArticlePoint {
  id: string;
  vector: number[];
  payload: any;
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
}
