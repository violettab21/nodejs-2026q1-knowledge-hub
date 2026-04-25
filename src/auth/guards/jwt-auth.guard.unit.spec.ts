import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('JWT Auth Guard', () => {
  let guard: JwtAuthGuard;

  const mockedReflector = {
    get: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockedReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if route is public', () => {
    mockedReflector.get.mockImplementation(() => true);
    const mockedContext = {
      getHandler: vi.fn(),
    } as vi.mock<ExecutionContext>;
    const canActivate = guard.canActivate(mockedContext);
    expect(canActivate).toBe(true);
  });

  it('should access route if route is not public and token is present', () => {
    mockedReflector.get.mockImplementation(() => false);
    const mockedContext = {
      getHandler: vi.fn(),
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn(),
        };
      }),
    } as vi.mock<ExecutionContext>;
    vi.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockReturnValue(true);
    const canActivate = guard.canActivate(mockedContext);
    expect(canActivate).toBe(true);
  });

  it('should throw an error if route is not public and token is invalid', () => {
    mockedReflector.get.mockImplementation(() => false);
    const mockedContext = {
      getHandler: vi.fn(),
      switchToHttp: vi.fn().mockImplementation(() => {
        return {
          getRequest: vi.fn(),
        };
      }),
    } as vi.mock<ExecutionContext>;
    vi.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockImplementation(
      () => {
        throw new UnauthorizedException();
      },
    );

    expect(() => guard.canActivate(mockedContext)).toThrow(
      new UnauthorizedException(),
    );
  });
});
