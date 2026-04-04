import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../entities/comment.entity';

export interface ICommentsStorage {
  getComments(): Comment[];
  createComment(createCommentDto: CreateCommentDto): Comment;
  removeComment(id: string): Comment;
}
