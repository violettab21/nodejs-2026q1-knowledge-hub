import { Injectable } from '@nestjs/common';
import { ICommentsStorage } from '../interfaces/comments.interface';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { randomUUID } from 'node:crypto';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsStorage implements ICommentsStorage {
  private comments: Comment[] = [];

  constructor() {}

  getComments() {
    return this.comments;
  }

  createComment(createCommentDto: CreateCommentDto) {
    const newComment: Comment = {
      id: randomUUID(),
      ...createCommentDto,
      authorId: createCommentDto.authorId || null,
      createdAt: Date.now(),
    };
    this.comments.push(newComment);
    return newComment;
  }

  removeComment(id: string) {
    const deletedComment = this.comments.find((comment) => comment.id === id);
    if (deletedComment) {
      this.comments = this.comments.filter((comment) => comment.id !== id);
      return deletedComment;
    }
    return null;
  }
}
