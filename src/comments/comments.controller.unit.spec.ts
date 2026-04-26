import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { NotFoundError } from '../errors/NotFoundError';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const testComments = [
    {
      id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
      content: 'comment1',
      articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
      authorId: null,
      createdAt: Number(new Date()),
    },
    {
      id: '7b493014-3945-4770-bd02-30f184b53eeb',
      content: 'comment2',
      articleId: '4e3f1630-be42-4bcc-ab7a-9544e419ec16',
      authorId: null,
      createdAt: Number(new Date()),
    },
  ];

  const mockedCommentsStorage = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
        {
          provide: 'ICommentsStorage',
          useValue: mockedCommentsStorage,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  describe('Get comments', () => {
    it('should return array of comments', async () => {
      vi.spyOn(service, 'findAll').mockResolvedValue(testComments);
      expect(
        await controller.findAll({
          articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
        }),
      ).toBe(testComments);
    });

    it('should return comment if it exists', async () => {
      vi.spyOn(service, 'findOne').mockResolvedValue(testComments[0]);
      expect(
        await controller.findOne({
          id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
        }),
      ).toBe(testComments[0]);
    });

    it('should throw error when comment not found', async () => {
      const id = 'e219c6b3-5242-4c66-8775-6bf26a301fb0';
      vi.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(controller.findOne({ id })).rejects.toThrow(
        new NotFoundError(`Comment with id ${id} is not found`),
      );
    });
  });

  describe('Create comment', () => {
    it('should return new comment if no errors', async () => {
      const newComment = {
        content: 'comment1',
        articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
      };
      const res = {
        id: 'e219c6b3-5242-4c66-8775-6bf26a302fb0',
        content: 'comment1',
        articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
        authorId: null,
        createdAt: Number(new Date()),
      };
      vi.spyOn(service, 'create').mockResolvedValue(res);
      expect(await controller.create(newComment)).toBe(res);
    });

    it('should throw error if articleId - non-existing article', async () => {
      const newComment = {
        content: 'comment1',
        articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
      };
      vi.spyOn(service, 'create').mockRejectedValue(new Error('articleId'));
      await expect(() => controller.create(newComment)).rejects.toThrow(
        new HttpException(
          `Non existing articleId`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });
  });

  describe('Delete comment', () => {
    it('should return deleted comment if no errors', async () => {
      const res = {
        id: 'e219c6b3-5242-4c66-8775-6bf26a302fb0',
        content: 'comment1',
        articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
        authorId: null,
        createdAt: new Date(),
      };
      vi.spyOn(service, 'remove').mockResolvedValue(res);
      expect(
        await controller.remove({ id: 'e219c6b3-5242-4c66-8775-6bf26a302fb0' }),
      ).toBe(res);
    });

    it('should throw error if comment not found', async () => {
      const id = 'e219c6b3-5242-4c66-8775-6bf26a302fb0';
      vi.spyOn(service, 'remove').mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2025',
          clientVersion: '1',
        }),
      );
      await expect(() => controller.remove({ id })).rejects.toThrow(
        new NotFoundError(`Comment with id ${id} is not found`),
      );
    });
  });
});
