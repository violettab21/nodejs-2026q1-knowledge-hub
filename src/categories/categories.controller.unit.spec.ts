import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { NotFoundError } from '../errors/NotFoundError';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const testCategories = [
    {
      id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
      name: 'Category1',
      description: 'Category1 description',
    },
    {
      id: '7b493014-3945-4770-bd02-30f184b53eeb',
      name: 'Category2',
      description: 'Category2 description',
    },
  ];

  const mockedCategoriesStorage = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: 'ICategoriesStorage',
          useValue: mockedCategoriesStorage,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('Get Categories', () => {
    it('should get all categories', async () => {
      vi.spyOn(service, 'findAll').mockResolvedValue(testCategories);
      expect(await controller.findAll({})).toBe(testCategories);
    });

    it('should get one category', async () => {
      vi.spyOn(service, 'findOne').mockResolvedValue(testCategories[0]);
      expect(
        await controller.findOne({
          id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
        }),
      ).toBe(testCategories[0]);
    });

    it('should throw an error if category not found', async () => {
      const id = 'e219c6b3-5242-4c66-8775-6bf26a301fb0';
      vi.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(() =>
        controller.findOne({
          id,
        }),
      ).rejects.toThrow(
        new NotFoundError(`Category with id ${id} is not found`),
      );
    });
  });

  describe('Create Category', () => {
    it('should create category', async () => {
      const res = {
        id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
        name: 'Category1',
        description: 'Category1 description',
      };
      vi.spyOn(service, 'create').mockResolvedValue(res);
      expect(
        await controller.create({
          name: 'Category1',
          description: 'Category1 description',
        }),
      ).toBe(res);
    });
  });

  describe('Update Category', () => {
    it('should update category if category exists', async () => {
      const res = {
        id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
        name: 'Category1',
        description: 'Category1 description',
      };
      vi.spyOn(service, 'update').mockResolvedValue(res);
      expect(
        await controller.update(
          { id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0' },
          {
            name: 'Category1',
            description: 'Category1 description',
          },
        ),
      ).toBe(res);
    });

    it('should throw error if category not found', async () => {
      const id = 'e219c6b3-5242-4c66-8775-6bf26a301fb0';
      vi.spyOn(service, 'update').mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2025',
          clientVersion: '1',
        }),
      );
      await expect(() =>
        controller.update(
          { id },
          {
            name: 'Category1',
            description: 'Category1 description',
          },
        ),
      ).rejects.toThrow(
        new NotFoundError(`Category with id ${id} is not found`),
      );
    });
  });

  describe('Delete Category', () => {
    it('should return deleted category if category exists', async () => {
      const res = {
        id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
        name: 'Category1',
        description: 'Category1 description',
      };
      vi.spyOn(service, 'remove').mockResolvedValue(res);
      expect(
        await controller.remove({ id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0' }),
      ).toBe(res);
    });

    it('should throw error if category not found', async () => {
      const id = 'e219c6b3-5242-4c66-8775-6bf26a301fb0';
      vi.spyOn(service, 'remove').mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2025',
          clientVersion: '1',
        }),
      );
      await expect(() => controller.remove({ id })).rejects.toThrow(
        new NotFoundError(`Category with id ${id} is not found`),
      );
    });
  });
});
