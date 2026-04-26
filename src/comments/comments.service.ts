import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ICommentsStorage } from './interfaces/comments.interface';
import { getPaginationData } from '../helpers/pagination/pagination';
import { sortData } from '../helpers/sorting/sorting';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class CommentsService {
  constructor(@Inject('ICommentsStorage') private storage: ICommentsStorage) {}
  async create(createCommentDto: CreateCommentDto) {
    try {
      const newComment = await this.storage.createComment(createCommentDto);
      return {
        ...newComment,
        createdAt: Number(newComment.createdAt),
      };
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        if (err.message.includes('authorId')) {
          throw new Error('authorId');
        }
        if (err.message.includes('articleId')) {
          throw new Error('articleId');
        }
      }
    }
  }

  async findAll(
    articleId: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    order?: 'asc' | 'desc',
  ) {
    const comments = await this.storage.getComments();
    let data = comments.filter((comment) => comment.articleId === articleId);
    if (sortBy && order) {
      data = sortData(sortBy, order, data);
    }
    if (page && limit) {
      return getPaginationData(+page, +limit, comments);
    }
    return data.map((el) => {
      return {
        ...el,
        createdAt: Number(el.createdAt),
      };
    });
  }

  async findOne(id: string) {
    const comment = await this.storage.getCommentById(id);
    if (comment) {
      return {
        ...comment,
        createdAt: Number(comment.createdAt),
      };
    }
    return null;
  }

  async remove(id: string) {
    return await this.storage.removeComment(id);
  }
}
