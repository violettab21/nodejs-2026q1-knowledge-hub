import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from 'generated/prisma/client';

export interface ICommentsStorage {
  getComments(): Promise<Comment[]>;
  createComment(createCommentDto: CreateCommentDto): Promise<Comment>;
  removeComment(id: string): Promise<Comment>;
  getCommentById(id: string): Promise<Comment>;
}

export interface IErrorResponse {
  error: boolean;
  message: string;
  field?: string;
}
