import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ICommentsStorage,
  IErrorResponse,
} from './interfaces/comments.interface';
import { ArticlesService } from 'src/articles/articles.service';
import { UsersService } from 'src/users/users.service';
import { Comment } from './entities/comment.entity';
import { getPaginationData } from 'src/helpers/pagination/pagination';
import { sortData } from 'src/helpers/sorting/sorting';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('ICommentsStorage') private storage: ICommentsStorage,
    @Inject(forwardRef(() => ArticlesService))
    private readonly articlesService: ArticlesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  create(createCommentDto: CreateCommentDto): Comment | IErrorResponse {
    const { articleId, authorId } = createCommentDto;
    const article = this.articlesService.findOne(articleId);
    if (!article) {
      return {
        error: true,
        message: 'Non-existing article id',
        field: 'articleId',
      };
    }
    if (authorId) {
      const author = this.usersService.findOne(authorId);
      if (!author) {
        return {
          error: true,
          message: 'Non-existing author id',
          field: 'authorId',
        };
      }
    }
    return this.storage.createComment(createCommentDto);
  }

  findAll(
    articleId: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    order?: 'asc' | 'desc',
  ) {
    const comments = this.storage.getComments();
    let data = comments.filter((comment) => comment.articleId === articleId);
    if (sortBy && order) {
      data = sortData(sortBy, order, data);
    }
    if (page && limit) {
      return getPaginationData(+page, +limit, comments);
    }
    return data;
  }

  findOne(id: string) {
    const comment = this.storage.getCommentById(id);
    if (comment) {
      return comment;
    }
    return null;
  }

  remove(id: string) {
    return this.storage.removeComment(id);
  }

  removeUserComments(authorId: string) {
    const comments = this.storage.getComments();
    comments.forEach((comment) => {
      if (comment.authorId === authorId) {
        this.remove(comment.id);
      }
    });
  }

  removeArticleComments(articleId: string) {
    const comments = this.storage.getComments();
    comments.forEach((comment) => {
      if (comment.articleId === articleId) {
        this.remove(comment.id);
      }
    });
  }
}
