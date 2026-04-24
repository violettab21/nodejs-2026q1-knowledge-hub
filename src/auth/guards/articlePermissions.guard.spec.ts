import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { ArticleStatus, UserRole } from '../../../generated/prisma/enums';
import { PermissionsArticlesGuard } from './articlePermissions.guard';
import { IArticlesStorage } from 'src/articles/interfaces/articles.interface';

describe('PermissionsArticlesGuard', () => {
  let guard: PermissionsArticlesGuard;

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
    getArticleById: vi
      .fn()
      .mockImplementation((articleId) =>
        articles.find((article) => article.id === articleId),
      ),
  } as vi.mocked<IArticlesStorage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsArticlesGuard,
        {
          provide: 'IArticlesStorage',
          useValue: mockedArticlesStorage,
        },
      ],
    }).compile();

    guard = module.get<PermissionsArticlesGuard>(PermissionsArticlesGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if user-editor creates own article', async () => {
    const userId = 'cf40cade-418a-4464-8b47-fc46a107cf75';

    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId, role: UserRole.EDITOR },
              method: 'POST',
              body: {
                ...newTestArticle,
                authorId: userId,
              },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = await guard.canActivate(mockedContext);
    expect(canActivate).toBe(true);
  });

  it('should return false if user-editor creates article by another user', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    const userId2 = 'cf40cade-418a-4464-8b47-fc46a107cf74';
    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId1, role: UserRole.EDITOR },
              method: 'POST',
              body: {
                ...newTestArticle,
                authorId: userId2,
              },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = await guard.canActivate(mockedContext);
    expect(canActivate).toBe(false);
  });

  it('should return true if user-editor updates own article', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    mockedArticlesStorage.getArticleById.mockResolvedValue({
      id: '206fce25-a5e4-474c-8f3c-24b045642e5d',
      title: 'Article2',
      content: 'Article2 content',
      status: ArticleStatus.DRAFT,
      authorId: userId1,
      categoryId: null,
      createAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    });
    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId1, role: UserRole.EDITOR },
              method: 'PUT',
              params: {
                id: userId1,
              },
              body: {
                ...newTestArticle,
                authorId: userId1,
              },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = await guard.canActivate(mockedContext);
    expect(canActivate).toBe(true);
  });

  it('should return false if user-editor updates other user article', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    const userId2 = 'cf40cade-418a-4464-8b47-fc46a107cf74';
    mockedArticlesStorage.getArticleById.mockResolvedValue({
      id: '206fce25-a5e4-474c-8f3c-24b045642e5d',
      title: 'Article2',
      content: 'Article2 content',
      status: ArticleStatus.DRAFT,
      authorId: userId2,
      categoryId: null,
      createAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    });
    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId1, role: UserRole.EDITOR },
              method: 'PUT',
              params: {
                id: userId2,
              },
              body: {
                ...newTestArticle,
                authorId: userId2,
              },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = await guard.canActivate(mockedContext);
    expect(canActivate).toBe(false);
  });

  it('should return false if user-editor deletes other user article', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    const userId2 = 'cf40cade-418a-4464-8b47-fc46a107cf74';
    mockedArticlesStorage.getArticleById.mockResolvedValue({
      id: '206fce25-a5e4-474c-8f3c-24b045642e5d',
      title: 'Article2',
      content: 'Article2 content',
      status: ArticleStatus.DRAFT,
      authorId: userId2,
      categoryId: null,
      createAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    });
    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId1, role: UserRole.EDITOR },
              method: 'DELETE',
              params: {
                id: userId2,
              },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = await guard.canActivate(mockedContext);
    expect(canActivate).toBe(false);
  });

  it('should return true if user-editor deletes own article', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    mockedArticlesStorage.getArticleById.mockResolvedValue({
      id: '206fce25-a5e4-474c-8f3c-24b045642e5d',
      title: 'Article2',
      content: 'Article2 content',
      status: ArticleStatus.DRAFT,
      authorId: userId1,
      categoryId: null,
      createAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    });
    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId1, role: UserRole.EDITOR },
              method: 'DELETE',
              params: {
                id: userId1,
              },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = await guard.canActivate(mockedContext);
    expect(canActivate).toBe(true);
  });
});
