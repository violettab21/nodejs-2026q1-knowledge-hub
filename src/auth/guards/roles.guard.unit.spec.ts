import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

describe('Roles Guard', () => {
  let guard: RolesGuard;

  const mockedReflector = {
    get: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockedReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if role match', () => {
    mockedReflector.get.mockImplementation(() => ['ADMIN']);
    const mockedContext = {
      getHandler: vi.fn(),
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { role: 'ADMIN' },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;
    const canActivate = guard.canActivate(mockedContext);
    expect(canActivate).toBe(true);
  });

  it('should return false if role does not match', () => {
    mockedReflector.get.mockImplementation(() => ['ADMIN']);
    const mockedContext = {
      getHandler: vi.fn(),
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { role: 'EDITOR' },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;

    const canActivate = guard.canActivate(mockedContext);
    expect(canActivate).toBe(false);
  });

  it('should return true if roles are not provided', () => {
    mockedReflector.get.mockImplementation(() => null);
    const mockedContext = {
      getHandler: vi.fn(),
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn().mockImplementation(() => {
            return {
              user: { role: 'VIEWER' },
            };
          }),
        };
      }),
    } as vi.mock<ExecutionContext>;

    const canActivate = guard.canActivate(mockedContext);
    expect(canActivate).toBe(true);
  });
});
