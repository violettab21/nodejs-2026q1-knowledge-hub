import { Injectable } from '@nestjs/common';
import { ICommentsStorage } from '../interfaces/comments.interface';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { randomUUID } from 'node:crypto';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsStorage implements ICommentsStorage {
  private comments: Comment[] = [
    {
      id: 'bdf46cec-4491-4cb9-a8aa-0b59c4023211',
      content: 'Great article1',
      articleId: '9b33ae78-5292-450c-8250-af07205fc840',
      authorId: null,
      createdAt: 1775417193031,
    },
    {
      id: '5ddaf97d-debc-4d7d-bc4a-19e82a8e4151',
      content: 'Great article1 by user5',
      articleId: '9b33ae78-5292-450c-8250-af07205fc840',
      authorId: '01c9800c-07ea-4d59-bb04-015565e048cb',
      createdAt: 1775417284767,
    },
  ];

  constructor() {}

  getComments() {
    return this.comments;
  }

  getCommentById(id: string) {
    return this.comments.find((comment) => comment.id === id);
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
