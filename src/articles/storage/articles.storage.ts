import { randomUUID } from 'node:crypto';
import { CreateArticleDto } from '../dto/create-article.dto';
import { Article } from '../entities/article.entity';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Injectable } from '@nestjs/common';
import { IArticlesStorage } from '../interfaces/articles.interface';

@Injectable()
export class ArticlesStorage implements IArticlesStorage {
  private articles: Article[] = [];

  constructor() {}

  getArticles() {
    return this.articles;
  }

  getArticleById(id: string) {
    const foundArticle = this.articles.find((article) => article.id === id);
    if (foundArticle) {
      return foundArticle;
    }
    return null;
  }

  createArticle(createArticleDto: CreateArticleDto) {
    //TODO validate userId and categoryID is records exist
    const { status, authorId, categoryId, tags, ...rest } = createArticleDto;
    const newArticle: Article = {
      id: randomUUID(),
      ...rest,
      status: status || 'draft',
      authorId: authorId || null,
      categoryId: categoryId || null,
      tags: tags || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.articles.push(newArticle);
    return newArticle;
  }

  updateArticle(id: string, updateArticleDto: UpdateArticleDto) {
    //TODO validate userId and categoryID if records exist
    const updatedArticle = this.articles.find((article) => article.id === id);

    if (updatedArticle) {
      Object.assign(updatedArticle, {
        ...updateArticleDto,
        updatedAt: Date.now(),
      });

      return updatedArticle;
    }
    return null;
  }

  removeArticle(id: string) {
    const deletedArticle = this.articles.find((article) => article.id === id);
    if (deletedArticle) {
      this.articles = this.articles.filter((article) => article.id !== id);
      return deletedArticle;
    }
    return null;
  }
}
