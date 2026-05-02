import { Injectable } from '@nestjs/common';
import { SummarizeArticleResponse } from './interfaces/summarizeArticle.interface';
import { TranslateArticleResponse } from './interfaces/translateArticle.interface';
import 'dotenv/config';

interface Cache {
  response: SummarizeArticleResponse | TranslateArticleResponse;
  createdAt: number;
}

@Injectable()
export class CacheService {
  cache: Map<string, Cache> = new Map();
  limit = Number(process.env.AI_CACHE_TTL_SEC) * 1000 || 300000;

  getCachedResponseByKey(key: string) {
    const cache = this.cache.get(key);

    if (!cache) {
      return null;
    }
    if (this.isCacheExpired(key)) {
      console.log('Removing cache');
      this.deleteCache(key);
      return null;
    }
    return cache.response;
  }

  setCachedResponse(
    key: string,
    response: SummarizeArticleResponse | TranslateArticleResponse,
  ) {
    const time = new Date().getTime();
    this.cache.set(key, { response, createdAt: time });
  }

  deleteCache(key: string) {
    this.cache.delete(key);
  }

  isCacheExpired(key: string) {
    const cache = this.cache.get(key);
    if (!cache) {
      return null;
    }
    const now = new Date().getTime();
    const createdAt = cache.createdAt;
    return now - createdAt > this.limit;
  }
}
