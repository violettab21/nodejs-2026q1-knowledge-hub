import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  IArticlesStorage,
  IErrorResponse,
} from './interfaces/articles.interface';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Article } from './entities/article.entity';
import { CommentsService } from 'src/comments/comments.service';
import { ArticleStatus } from './enums/article.enum';
import { getPaginationData } from 'src/helpers/pagination/pagination';
import { sortData } from 'src/helpers/sorting/sorting';
import { AUTHOR_NOT_EXIST, CATEGORY_NOT_EXIST } from 'src/constants/constants';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('IArticlesStorage')
    private storage: IArticlesStorage,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
  ) {}
  create(createArticleDto: CreateArticleDto): Article | IErrorResponse {
    const { authorId, categoryId } = createArticleDto;
    if (authorId) {
      const user = this.usersService.findOne(authorId);
      if (!user) {
        return {
          error: true,
          message: AUTHOR_NOT_EXIST,
          field: 'authorId',
        };
      }
    }
    if (categoryId) {
      const category = this.categoriesService.findOne(categoryId);
      if (!category) {
        return {
          error: true,
          message: CATEGORY_NOT_EXIST,
          field: 'categoryId',
        };
      }
    }
    return this.storage.createArticle(createArticleDto);
  }

  findAll(
    status?: ArticleStatus,
    categoryId?: string,
    tag?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    order?: 'asc' | 'desc',
  ) {
    const articles = this.storage.getArticles();
    let data = articles;
    if (status || categoryId || tag) {
      data = articles.filter((article) => {
        return (
          (status ? article.status === status : true) &&
          (categoryId ? article.categoryId === categoryId : true) &&
          (tag ? article.tags.includes(tag) : true)
        );
      });
    }

    if (sortBy && order) {
      data = sortData(sortBy, order, data);
    }
    if (page && limit) {
      return getPaginationData(+page, +limit, data);
    }

    return data;
  }

  findOne(id: string) {
    return this.storage.getArticleById(id);
  }

  findUserArticles(userId: string) {
    return this.storage
      .getArticles()
      .filter((article) => article.authorId === userId);
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    const { authorId, categoryId } = updateArticleDto;
    if (authorId) {
      const user = this.usersService.findOne(authorId);
      if (!user) {
        return {
          error: true,
          message: AUTHOR_NOT_EXIST,
          field: 'authorId',
        };
      }
    }
    if (categoryId) {
      const category = this.categoriesService.findOne(categoryId);
      if (!category) {
        return {
          error: true,
          message: CATEGORY_NOT_EXIST,
          field: 'categoryId',
        };
      }
    }

    return this.storage.updateArticle(id, updateArticleDto);
  }

  remove(id: string) {
    const article = this.storage.removeArticle(id);
    if (article) {
      this.commentsService.removeArticleComments(article.id);
      return article;
    }
    return;
  }

  cleanAuthorId(userId: string) {
    const articles = this.storage
      .getArticles()
      .filter((article) => article.authorId === userId);
    articles.forEach((article) => {
      article.authorId = null;
    });
  }

  cleanCategoryId(categoryId: string) {
    const articles = this.storage
      .getArticles()
      .filter((article) => article.categoryId === categoryId);
    articles.forEach((article) => {
      article.categoryId = null;
    });
  }
}
