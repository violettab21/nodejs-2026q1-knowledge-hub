import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { PermissionsUsersGuard } from './usersPermissions.guard';
import { UserRole } from '../../../generated/prisma/enums';

describe('PermissionsUsersGuard Guard', () => {
  let guard: PermissionsUsersGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsUsersGuard],
    }).compile();

    guard = module.get<PermissionsUsersGuard>(PermissionsUsersGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if user-editor edits own user', async () => {
    const userId = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId, role: UserRole.EDITOR },
              method: 'PUT',
              params: {
                id: userId,
              },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = await guard.canActivate(mockedContext);
    expect(canActivate).toBe(true);
  });

  it('should return false if user-editor edits other users', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    const userId2 = 'c32af754-2460-4d62-9f2e-1b7950b18d34';
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
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = await guard.canActivate(mockedContext);
    expect(canActivate).toBe(false);
  });

  it('should return true if user-editor deletes own user', async () => {
    const userId = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId, role: UserRole.EDITOR },
              method: 'DELETE',
              params: {
                id: userId,
              },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = await guard.canActivate(mockedContext);
    expect(canActivate).toBe(true);
  });

  it('should return false if user-editor deletes other users', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    const userId2 = 'c32af754-2460-4d62-9f2e-1b7950b18d34';
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

  it('should return true if user-editor get user', async () => {
    const userId1 = 'cf40cade-418a-4464-8b47-fc46a107cf75';
    const userId2 = 'c32af754-2460-4d62-9f2e-1b7950b18d34';
    const mockedContext = {
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { userId: userId1, role: UserRole.EDITOR },
              method: 'GET',
              params: {
                id: userId2,
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
