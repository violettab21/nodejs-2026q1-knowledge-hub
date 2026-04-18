import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Injectable } from '@nestjs/common';
import { IArticlesStorage } from '../interfaces/articles.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleStatus } from 'generated/prisma/enums';

@Injectable()
export class ArticlesStorage implements IArticlesStorage {
  constructor(private prisma: PrismaService) {}

  async getArticles() {
    return await this.prisma.article.findMany({ include: { tags: true } });
  }

  async getArticleById(id: string) {
    return this.prisma.article.findUnique({
      where: {
        id: id,
      },
      include: { tags: true },
    });
  }

  async filterArticles(
    status?: ArticleStatus,
    categoryId?: string,
    tag?: string,
  ) {
    const filterCondition: {
      status?: ArticleStatus;
      categoryId?: string;
      tags?: {
        some: {
          name: string;
        };
      };
    } = {};
    if (status) {
      filterCondition.status = status;
    }
    if (categoryId) {
      filterCondition.categoryId = categoryId;
    }
    if (tag) {
      filterCondition.tags = {
        some: {
          name: tag,
        },
      };
    }
    const articles = this.prisma.article.findMany({
      where: filterCondition,
      include: { tags: true },
    });
    return articles;
  }

  async createArticle(createArticleDto: CreateArticleDto) {
    const { status, authorId, categoryId, tags } = createArticleDto;
    const newArticle = await this.prisma.article.create({
      data: {
        ...createArticleDto,
        status: status || ArticleStatus.DRAFT,
        authorId: authorId || null,
        categoryId: categoryId || null,
        tags: tags && {
          connectOrCreate: tags.map((tag) => {
            return {
              create: {
                name: tag,
              },
              where: {
                name: tag,
              },
            };
          }),
        },
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      include: { tags: true },
    });

    return newArticle;
  }

  async updateArticle(id: string, updateArticleDto: UpdateArticleDto) {
    return await this.prisma.article.update({
      where: { id: id },
      data: {
        ...updateArticleDto,

        /*  authorId: updateArticleDto.authorId || null,
        categoryId: updateArticleDto.categoryId || null,*/
        tags: {
          set: [],
          connectOrCreate:
            updateArticleDto.tags &&
            updateArticleDto.tags.map((tag) => {
              return {
                create: {
                  name: tag,
                },
                where: {
                  name: tag,
                },
              };
            }),
        },
        updatedAt: new Date(Date.now()),
      },
      include: { tags: true },
    });
  }

  async removeArticle(id: string) {
    return await this.prisma.article.delete({
      where: { id: id },
      include: { tags: true },
    });
  }
}
