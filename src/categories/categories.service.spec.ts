import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ICategoriesStorage } from './interfaces/categories.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const newTestCategory = {
    name: 'Category3',
    description: 'Category3 description',
  };

  const categories = [
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

  const mockedCategoriesStorage = {
    getCategories: vi.fn().mockImplementation(() => categories),
    getCategoryById: vi
      .fn()
      .mockImplementation((categoryId) =>
        categories.find((category) => category.id === categoryId),
      ),
    createCategory: vi
      .fn()
      .mockImplementation((createCategoryDto: CreateCategoryDto) => {
        return {
          id: '7a6e04c1-bbda-4891-894b-bdad8b949ef7',
          ...createCategoryDto,
        };
      }),
    updateCategory: vi
      .fn()
      .mockImplementation((id, updateCategoryDto: UpdateCategoryDto) => {
        //const category = categories.find((category) => category.id === id);
        return {
          id: id,
          ...updateCategoryDto,
        };
      }),
    removeCategory: vi.fn().mockImplementation((id) => {
      const category = categories.find((category) => category.id === id);
      return {
        ...category,
      };
    }),
  } as vi.mocked<ICategoriesStorage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: 'ICategoriesStorage',
          useValue: mockedCategoriesStorage,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all categories', async () => {
    const receivedCategories = await service.findAll();
    expect(receivedCategories).toBe(categories);
    expect(mockedCategoriesStorage.getCategories).toHaveBeenCalled();
  });

  it('should get category by id', async () => {
    const receivedCategory = await service.findOne(
      'e219c6b3-5242-4c66-8775-6bf26a301fb0',
    );
    expect(receivedCategory).toBe(categories[0]);
    expect(mockedCategoriesStorage.getCategoryById).toHaveBeenCalled();
  });

  it('should get category by id', async () => {
    const id = 'e219c6b3-5242-4c66-8775-6bf26a301fb0';
    const receivedCategory = await service.findOne(id);
    expect(receivedCategory).toBe(categories[0]);
    expect(mockedCategoriesStorage.getCategoryById).toHaveBeenCalledWith(id);
  });

  it('should trigger create category', async () => {
    const newCategory = await service.create(newTestCategory);
    expect('name' in newCategory).toBe(true);
    expect('id' in newCategory).toBe(true);
    expect('description' in newCategory).toBe(true);
    expect(mockedCategoriesStorage.createCategory).toHaveBeenCalledWith(
      newTestCategory,
    );
  });

  it('should trigger update category', async () => {
    const id = 'e219c6b3-5242-4c66-8775-6bf26a301fb0';
    const updCategory = await service.update(id, newTestCategory);
    expect('name' in updCategory).toBe(true);
    expect('id' in updCategory).toBe(true);
    expect('description' in updCategory).toBe(true);
    expect(mockedCategoriesStorage.updateCategory).toHaveBeenCalledWith(
      id,
      newTestCategory,
    );
  });

  it('should trigger delete category', async () => {
    const id = 'e219c6b3-5242-4c66-8775-6bf26a301fb0';
    const delCategory = await service.remove(id);
    expect('name' in delCategory).toBe(true);
    expect('id' in delCategory).toBe(true);
    expect('description' in delCategory).toBe(true);
    expect(mockedCategoriesStorage.removeCategory).toHaveBeenCalledWith(id);
  });
});
