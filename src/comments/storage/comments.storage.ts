import { Injectable } from '@nestjs/common';
import { ICommentsStorage } from '../interfaces/comments.interface';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsStorage implements ICommentsStorage {
  constructor(private prisma: PrismaService) {}

  async getComments() {
    return await this.prisma.comment.findMany();
  }

  async getCommentById(id: string) {
    return await this.prisma.comment.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createComment(createCommentDto: CreateCommentDto) {
    const newComment = await this.prisma.comment.create({
      data: {
        ...createCommentDto,
        authorId: createCommentDto.authorId || null,
        createdAt: new Date(Date.now()),
      },
    });
    return newComment;
  }

  async removeComment(id: string) {
    return await this.prisma.comment.delete({
      where: { id: id },
    });
  }
}
