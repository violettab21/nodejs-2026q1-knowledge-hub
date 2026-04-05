import { randomUUID } from 'node:crypto';
import { CreateArticleDto } from '../dto/create-article.dto';
import { Article } from '../entities/article.entity';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Injectable } from '@nestjs/common';
import { IArticlesStorage } from '../interfaces/articles.interface';
import { ArticleStatus } from '../enums/article.enum';

@Injectable()
export class ArticlesStorage implements IArticlesStorage {
  private articles: Article[] = [
    {
      id: '300de465-e86d-4982-8022-54d75572c9ee',
      title: 'Article3',
      content: 'Article3 content',
      status: ArticleStatus.Published,
      authorId: 'd132a160-91f2-45fb-b5c6-809be78fbd50',
      categoryId: 'f8123359-86ca-428d-9fab-b6b3627a4583',
      tags: ['hello', 'test'],
      createdAt: 1775416766281,
      updatedAt: 1775416766281,
    },
    {
      id: '9b33ae78-5292-450c-8250-af07205fc840',
      title: 'Article1',
      content: 'Article1 content',
      status: ArticleStatus.Draft,
      authorId: '01c9800c-07ea-4d59-bb04-015565e048cb',
      categoryId: '5f92a2a3-2d23-4020-a16d-42916890a3a2',
      tags: ['beauty', 'test'],
      createdAt: 1775416648106,
      updatedAt: 1775416648106,
    },
    {
      id: 'a491a98f-b886-468a-8093-42bfa51a8d43',
      title: 'Article2',
      content: 'Article2 content',
      status: ArticleStatus.Archived,
      authorId: '01c9800c-07ea-4d59-bb04-015565e048cb',
      categoryId: 'f8123359-86ca-428d-9fab-b6b3627a4583',
      tags: ['health', 'test'],
      createdAt: 1775416696868,
      updatedAt: 1775416696868,
    },
  ];

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
    const { status, authorId, categoryId, tags, ...rest } = createArticleDto;
    const newArticle: Article = {
      id: randomUUID(),
      ...rest,
      status: status || ArticleStatus.Draft,
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
    const updatedArticle = this.articles.find((article) => article.id === id);
    const replaceWith = {
      ...updateArticleDto,
      authorId: updateArticleDto.authorId || null,
      categoryId: updateArticleDto.categoryId || null,
      tags: updateArticleDto.tags || [],
      updatedAt: Date.now(),
    };
    if (updatedArticle) {
      Object.assign(updatedArticle, replaceWith);

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
