import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../../generated/prisma/enums';
import { PermissionsCommentsGuard } from './commentsPermissions.guard';
import { ICommentsStorage } from 'src/comments/interfaces/comments.interface';

describe('PermissionsCommentsGuard', () => {
  let guard: PermissionsCommentsGuard;
  const newTestComment = {
    content: 'Comment',
    articleId: '1bb3634e-7ffa-46a7-8507-64a66c815816',
    authorId: null,
  };

  const comments = [
    {
      id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
      content: 'comment1',
      articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
      authorId: null,
      createdAt: new Date(),
    },
    {
      id: '7b493014-3945-4770-bd02-30f184b53eeb',
      content: 'comment2',
      articleId: '4e3f1630-be42-4bcc-ab7a-9544e419ec16',
      authorId: null,
      createdAt: new Date(),
    },
  ];

  const mockedCommentsStorage = {
    getCommentById: vi
      .fn()
      .mockImplementation((commentId) =>
        comments.find((comment) => comment.id === commentId),
      ),
  } as vi.mocked<ICommentsStorage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsCommentsGuard,
        {
          provide: 'ICommentsStorage',
          useValue: mockedCommentsStorage,
        },
      ],
    }).compile();

    guard = module.get<PermissionsCommentsGuard>(PermissionsCommentsGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if user-editor creates own comments', async () => {
    const userId = 'cf40cade-418a-4464-8b47-fc46a107cf75';

    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId, role: UserRole.EDITOR },
              method: 'POST',
              body: {
                ...newTestComment,
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

  it('should return false if user-editor creates comment by another user', async () => {
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
                ...newTestComment,
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

  it('should return false if user-editor deletes other user comments', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    const userId2 = 'cf40cade-418a-4464-8b47-fc46a107cf74';
    mockedCommentsStorage.getCommentById.mockResolvedValue({
      id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
      content: 'comment1',
      articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
      authorId: userId2,
      createdAt: new Date(),
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

  it('should return true if user-editor deletes own comments', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    mockedCommentsStorage.getCommentById.mockResolvedValue({
      id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
      content: 'comment1',
      articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
      authorId: userId1,
      createdAt: new Date(),
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
