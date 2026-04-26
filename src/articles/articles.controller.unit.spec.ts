import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleStatus } from '../../generated/prisma/enums';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BAD_REQUEST_MESSAGE, NOT_FOUND_MESSAGE } from '../constants/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  const articles = [
    {
      id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c',
      title: 'Article1',
      content: 'Article1 content',
      status: ArticleStatus.DRAFT,
      authorId: null,
      categoryId: null,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
      tags: ['tag1', 'tag2'],
    },
    {
      id: '206fce25-a5e4-474c-8f3c-24b045642e5d',
      title: 'Article2',
      content: 'Article2 content',
      status: ArticleStatus.DRAFT,
      authorId: null,
      categoryId: null,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
      tags: [],
    },
  ];

  const mockedArticlesStorage = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        ArticlesService,
        {
          provide: 'IArticlesStorage',
          useValue: mockedArticlesStorage,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get articles', () => {
    it('should return articles', async () => {
      vi.spyOn(service, 'findAll').mockResolvedValue(articles);
      expect(await controller.findAll({})).toBe(articles);
    });

    it('should return article if article exists', async () => {
      const id = '1e27b6f3-fa40-44e8-8baf-9ede2f71249c';
      vi.spyOn(service, 'findOne').mockResolvedValue(articles[0]);
      expect(await controller.findOne({ id })).toBe(articles[0]);
    });

    it('should throw an error if article not found', async () => {
      const id = '1e27b6f3-fa40-44e8-8baf-9ede2f71249c';
      vi.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(() => controller.findOne({ id })).rejects.toThrow(
        new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('create article', () => {
    it('should return new article if article created without errors', async () => {
      const newArticle = {
        title: 'Article1',
        content: 'Article1 content',
        categoryId: null,
        authorId: null,
      };
      const res = {
        id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c',
        title: 'Article1',
        content: 'Article1 content',
        status: ArticleStatus.DRAFT,
        authorId: null,
        categoryId: null,
        createdAt: Number(new Date()),
        updatedAt: Number(new Date()),
        tags: ['tag1', 'tag2'],
      };
      vi.spyOn(service, 'create').mockResolvedValue(res);
      expect(await controller.create(newArticle)).toBe(res);
    });

    it('should throw an error if invalid categoryId or authorId passed', async () => {
      const newArticle = {
        title: 'Article1',
        content: 'Article1 content',
        categoryId: null,
        authorId: null,
      };
      vi.spyOn(service, 'create').mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2003',
          clientVersion: '1',
        }),
      );
      await expect(() => controller.create(newArticle)).rejects.toThrow(
        new HttpException(
          'Non existing category or author',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });

    it('should throw an error if invalid tags passed', async () => {
      const newArticle = {
        title: 'Article1',
        content: 'Article1 content',
        categoryId: null,
        authorId: null,
      };
      vi.spyOn(service, 'create').mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2002',
          clientVersion: '1',
        }),
      );
      await expect(() => controller.create(newArticle)).rejects.toThrow(
        new HttpException(BAD_REQUEST_MESSAGE, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('update article', () => {
    it('should return updated article if article updated without errors', async () => {
      const newArticle = {
        title: 'Article1',
        content: 'Article1 content',
        categoryId: null,
        authorId: null,
      };
      const res = {
        id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c',
        title: 'Article1',
        content: 'Article1 content',
        status: ArticleStatus.DRAFT,
        authorId: null,
        categoryId: null,
        createdAt: Number(new Date()),
        updatedAt: Number(new Date()),
        tags: ['tag1', 'tag2'],
      };
      vi.spyOn(service, 'update').mockResolvedValue(res);
      expect(
        await controller.update(
          { id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c' },
          newArticle,
        ),
      ).toBe(res);
    });

    it('should throw an error if article not found', async () => {
      const newArticle = {
        title: 'Article1',
        content: 'Article1 content',
        categoryId: null,
        authorId: null,
      };
      vi.spyOn(service, 'update').mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2025',
          clientVersion: '1',
        }),
      );
      await expect(() =>
        controller.update(
          { id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c' },
          newArticle,
        ),
      ).rejects.toThrow(
        new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if prisma uniq constraint occurred', async () => {
      const newArticle = {
        title: 'Article1',
        content: 'Article1 content',
        categoryId: null,
        authorId: null,
      };
      vi.spyOn(service, 'update').mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2002',
          clientVersion: '1',
        }),
      );
      await expect(() =>
        controller.update(
          { id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c' },
          newArticle,
        ),
      ).rejects.toThrow(
        new HttpException(BAD_REQUEST_MESSAGE, HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if prisma foreign key error occurred', async () => {
      const newArticle = {
        title: 'Article1',
        content: 'Article1 content',
        categoryId: null,
        authorId: null,
      };
      vi.spyOn(service, 'update').mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2003',
          clientVersion: '1',
        }),
      );
      await expect(() =>
        controller.update(
          { id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c' },
          newArticle,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Non existing category or author',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });
  });

  describe('delete article', () => {
    it('should return deleted article if article deleted without errors', async () => {
      const res = {
        id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c',
        title: 'Article1',
        content: 'Article1 content',
        status: ArticleStatus.DRAFT,
        authorId: null,
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [{ id: '1', name: 'tag1' }],
      };
      vi.spyOn(service, 'remove').mockResolvedValue(res);
      expect(
        await controller.remove({ id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c' }),
      ).toBe(res);
    });

    it('should throw an error if article not found', async () => {
      vi.spyOn(service, 'remove').mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2025',
          clientVersion: '1',
        }),
      );
      await expect(() =>
        controller.remove({ id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c' }),
      ).rejects.toThrow(
        new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND),
      );
    });
  });
});
