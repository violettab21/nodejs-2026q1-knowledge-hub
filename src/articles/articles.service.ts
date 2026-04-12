import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IArticlesStorage } from './interfaces/articles.interface';
import { getPaginationData } from 'src/helpers/pagination/pagination';
import { sortData } from 'src/helpers/sorting/sorting';
import { ArticleStatus } from 'generated/prisma/enums';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('IArticlesStorage')
    private storage: IArticlesStorage,
  ) {}
  async create(createArticleDto: CreateArticleDto) {
    try {
      const newArticle = await this.storage.createArticle(createArticleDto);
      const { tags, createdAt, updatedAt, ...rest } = newArticle;
      return {
        ...rest,
        tags: tags.map((tag) => tag.name),
        createdAt: Number(createdAt),
        updatedAt: Number(updatedAt),
      };
    } catch (err) {
      throw err;
    }
  }

  async findAll(
    status?: ArticleStatus,
    categoryId?: string,
    tag?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    order?: 'asc' | 'desc',
  ) {
    const articles = await this.storage.filterArticles(status, categoryId, tag);
    let data = articles.map(({ tags, createdAt, updatedAt, ...rest }) => {
      return {
        ...rest,
        tags: tags.map((tag) => tag.name),
        createdAt: Number(createdAt),
        updatedAt: Number(updatedAt),
      };
    });

    if (sortBy && order) {
      data = sortData(sortBy, order, data);
    }
    if (page && limit) {
      return getPaginationData(+page, +limit, data);
    }

    return data;
  }

  async findOne(id: string) {
    const article = await this.storage.getArticleById(id);
    if (article) {
      const { tags, createdAt, updatedAt, ...rest } = article;
      return {
        ...rest,
        tags: tags.map((tag) => tag.name),
        createdAt: Number(createdAt),
        updatedAt: Number(updatedAt),
      };
    }
    return null;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.storage.updateArticle(id, updateArticleDto);
    const { tags, createdAt, updatedAt, ...rest } = article;
    return {
      ...rest,
      tags: tags.map((tag) => tag.name),
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };
  }

  async remove(id: string) {
    const article = await this.storage.removeArticle(id);

    return article;
  }
}
