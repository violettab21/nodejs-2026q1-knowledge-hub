import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ICommentsStorage,
  IErrorResponse,
} from './interfaces/comments.interface';
import { ArticlesService } from 'src/articles/articles.service';
import { UsersService } from 'src/users/users.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('ICommentsStorage') private storage: ICommentsStorage,
    private readonly articlesService: ArticlesService,
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
    if (authorId !== null) {
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

  findAll(articleId: string) {
    const comments = this.storage.getComments();
    return comments.filter((comment) => comment.articleId === articleId);
  }

  remove(id: string) {
    return this.storage.removeComment(id);
  }
}
