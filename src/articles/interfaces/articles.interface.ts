import { Article } from 'generated/prisma/client';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

export interface IArticlesStorage {
  getArticles(): Promise<
    ({
      tags: {
        name: string;
        id: string;
      }[];
    } & Article)[]
  >;
  getArticleById(id: string): Promise<
    {
      tags: {
        name: string;
        id: string;
      }[];
    } & Article
  >;
  createArticle(createArticleDto: CreateArticleDto): Promise<
    {
      tags: {
        name: string;
        id: string;
      }[];
    } & Article
  >;
  updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<
    {
      tags: {
        name: string;
        id: string;
      }[];
    } & Article
  >;
  removeArticle(id: string): Promise<
    {
      tags: {
        name: string;
        id: string;
      }[];
    } & Article
  >;
}

export interface IErrorResponse {
  error: boolean;
  message: string;
  field?: string;
}
