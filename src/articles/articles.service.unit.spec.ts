import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { IArticlesStorage } from './interfaces/articles.interface';
import { ArticleStatus } from '../../generated/prisma/enums';
import { CreateArticleDto } from './dto/create-article.dto';
import * as pagination from '../helpers/pagination/pagination';
import * as sorting from '../helpers/sorting/sorting';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const newTestArticle = {
    title: 'Article3 NEW ARTICLE',
    content: 'Article3 content',
    authorId: null,
    categoryId: null,
    tags: ['tag1', 'tag2'],
  };

  const articles = [
    {
      id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c',
      title: 'Article1',
      content: 'Article1 content',
      status: ArticleStatus.DRAFT,
      authorId: null,
      categoryId: null,
      createAt: new Date(),
      updatedAt: new Date(),
      tags: [
        {
          name: 'tag1',
          id: '1',
        },
        {
          name: 'tag2',
          id: '2',
        },
      ],
    },
    {
      id: '206fce25-a5e4-474c-8f3c-24b045642e5d',
      title: 'Article2',
      content: 'Article2 content',
      status: ArticleStatus.DRAFT,
      authorId: null,
      categoryId: null,
      createAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    },
  ];

  const mockedArticlesStorage = {
    getArticles: vi.fn().mockImplementation(() => articles),
    getArticleById: vi
      .fn()
      .mockImplementation((articleId) =>
        articles.find((article) => article.id === articleId),
      ),
    filterArticles: vi.fn(),
    createArticle: vi
      .fn()
      .mockImplementation((createArticleDTO: CreateArticleDto) => {
        return {
          id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c',
          ...createArticleDTO,
          status: createArticleDTO.status || ArticleStatus.DRAFT,
          tags: createArticleDTO.tags.map((tag, index) => {
            return {
              id: index,
              name: tag,
            };
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    updateArticle: vi.fn(),
    removeArticle: vi.fn().mockImplementation((id) => {
      const article = articles.find((article) => article.id === id);
      return {
        ...article,
      };
    }),
  } as vi.mocked<IArticlesStorage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: 'IArticlesStorage',
          useValue: mockedArticlesStorage,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should get all articles', async () => {
    mockedArticlesStorage.filterArticles.mockResolvedValueOnce(articles);
    await service.findAll();

    expect(mockedArticlesStorage.filterArticles).toHaveBeenCalled();
  });

  it('should call articles with pages when page and limit passed', async () => {
    mockedArticlesStorage.filterArticles.mockResolvedValueOnce(articles);
    const spy = vi.spyOn(pagination, 'getPaginationData');
    await service.findAll(undefined, undefined, undefined, 2, 10);

    expect(spy).toHaveBeenCalled();
  });

  it('should call articles with sorting when sortBy and order passed', async () => {
    mockedArticlesStorage.filterArticles.mockResolvedValueOnce(articles);
    const spy = vi.spyOn(sorting, 'sortData');
    await service.findAll(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'title',
      'asc',
    );

    expect(spy).toHaveBeenCalled();
  });

  it('should get one article by id', async () => {
    const id = '1e27b6f3-fa40-44e8-8baf-9ede2f71249c';
    const article = await service.findOne(id);

    expect(mockedArticlesStorage.getArticleById).toHaveBeenCalledWith(id);
    expect(article.title).toBe(articles[0].title);
    expect(article.content).toBe(articles[0].content);
    expect(article.tags.length).toBe(articles[0].tags.length);
  });

  it('should return null if no article found', async () => {
    mockedArticlesStorage.getArticleById.mockResolvedValue(null);
    const id = '1e27b6f3-fa40-44e8-8baf-9ede2f71249c';
    const article = await service.findOne(id);

    expect(mockedArticlesStorage.getArticleById).toHaveBeenCalledWith(id);
    expect(article).toBeNull();
  });

  it('should create article', async () => {
    const article = await service.create(newTestArticle);

    expect(mockedArticlesStorage.createArticle).toHaveBeenCalledWith(
      newTestArticle,
    );
    expect(article.title).toBe(newTestArticle.title);
    expect(article.content).toBe(newTestArticle.content);
    expect(article.tags).toStrictEqual(newTestArticle.tags);
  });

  it('should throw an error if failed to create article', async () => {
    mockedArticlesStorage.createArticle.mockRejectedValueOnce(new Error());
    expect(mockedArticlesStorage.createArticle).toHaveBeenCalledWith(
      newTestArticle,
    );
    await expect(() => service.create(newTestArticle)).rejects.toThrow(
      new Error(),
    );
  });

  it('should update article', async () => {
    mockedArticlesStorage.updateArticle.mockResolvedValueOnce({
      id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c',
      title: 'Article1',
      content: 'Article1 content',
      status: ArticleStatus.DRAFT,
      authorId: null,
      categoryId: null,
      createAt: new Date(),
      updatedAt: new Date(),
      tags: [
        {
          name: 'tag1',
          id: '1',
        },
        {
          name: 'tag2',
          id: '2',
        },
      ],
    });
    const id = '1e27b6f3-fa40-44e8-8baf-9ede2f71249c';
    await service.update(id, newTestArticle);

    expect(mockedArticlesStorage.updateArticle).toHaveBeenCalledWith(
      id,
      newTestArticle,
    );
  });

  it('should delete article', async () => {
    const id = '1e27b6f3-fa40-44e8-8baf-9ede2f71249c';
    await service.remove(id);

    expect(mockedArticlesStorage.removeArticle).toHaveBeenCalledWith(id);
  });
});
