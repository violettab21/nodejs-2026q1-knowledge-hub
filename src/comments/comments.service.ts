import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ICommentsStorage } from './interfaces/comments.interface';

@Injectable()
export class CommentsService {
  constructor(@Inject('ICommentsStorage') private storage: ICommentsStorage) {}
  create(createCommentDto: CreateCommentDto) {
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
