import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from '../../generated/prisma/enums';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ValidationError } from '../errors/ValidationError';
import { USER_EXISTS } from '../constants/constants';

describe('CategoriesController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockedUsersStorage = {};
  const mockedJWTService = {};
  const mockedUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'IUsersStorage',
          useValue: mockedUsersStorage,
        },
        {
          provide: JwtService,
          useValue: mockedJWTService,
        },
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login', () => {
    it('should return access token and refresh token', async () => {
      const res = {
        accessToken: 'test',
        refreshToken: 'token',
      };
      vi.spyOn(service, 'login').mockResolvedValue(res);
      expect(await controller.login({ login: 'test', password: 'test' })).toBe(
        res,
      );
    });

    it('should throw an error if AuthService throws error', async () => {
      vi.spyOn(service, 'login').mockRejectedValue(new Error());
      await expect(() =>
        controller.login({ login: 'test', password: 'test' }),
      ).rejects.toThrow(new Error());
    });
  });

  describe('Sign Up', () => {
    it('should return created user if user created without errors', async () => {
      const newUser = {
        id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
        login: 'TEST_USER1',
        role: UserRole.VIEWER,
        createdAt: Number(new Date()),
        updatedAt: Number(new Date()),
      };

      vi.spyOn(service, 'signUp').mockResolvedValue(newUser);
      expect(
        await controller.signUp({
          login: 'login',
          password: 'password',
        }),
      ).toBe(newUser);
    });

    it('should throw error if user already exists', async () => {
      vi.spyOn(service, 'signUp').mockResolvedValue(null);
      await expect(() =>
        controller.signUp({ login: 'test', password: 'test' }),
      ).rejects.toThrow(new ValidationError(USER_EXISTS));
    });
  });

  describe('Refresh', () => {
    it('should return access and refresh tokens if refresh token passed validation', async () => {
      const res = {
        accessToken: 'test',
        refreshToken: 'token',
      };
      vi.spyOn(service, 'refresh').mockResolvedValue(res);
      expect(await controller.refresh({ refreshToken: 'token' })).toBe(res);
    });

    it('should throw error if auth service failed', async () => {
      vi.spyOn(service, 'refresh').mockRejectedValue(new Error());
      await expect(() =>
        controller.refresh({ refreshToken: 'token' }),
      ).rejects.toThrow(new Error());
    });
  });
});
