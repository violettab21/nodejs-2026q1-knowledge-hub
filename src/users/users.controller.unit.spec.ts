import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from '../../generated/prisma/enums';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BAD_REQUEST_MESSAGE, NOT_FOUND_MESSAGE } from '../constants/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PASSWORD_INCORRECT, USER_NOT_FOUND } from './constants/constants';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const testUsers = [
    {
      id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
      login: 'TEST_USER1',
      role: UserRole.VIEWER,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
    },
    {
      id: '9121d4bb-3e75-41da-9863-4ac7b1dfcfed',
      login: 'TEST_USER2',
      role: UserRole.EDITOR,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
    },
  ];

  const mockedUsersStorage = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'IUsersStorage',
          useValue: mockedUsersStorage,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return array of users', async () => {
    vi.spyOn(service, 'findAll').mockResolvedValue(testUsers);
    expect(await controller.findAll({})).toBe(testUsers);
  });

  describe('findOne', () => {
    it('should return user when it is found by id', async () => {
      const id = '9121d4bb-3e75-41da-9863-5ac7b1dfcfed';
      vi.spyOn(service, 'findOne').mockResolvedValueOnce(testUsers[0]);
      expect(await controller.findOne({ id })).toBe(testUsers[0]);
    });

    it('should throw error when user is not found', async () => {
      const id = '9121d4bb-3e75-41da-9863-5ac7b1dfcfed';
      vi.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      await expect(controller.findOne({ id })).rejects.toThrow(
        new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('create user', () => {
    it('should return new user when it is returned by service', async () => {
      const newUser = {
        id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
        login: 'TEST_USER1',
        role: UserRole.VIEWER,
        createdAt: Number(new Date()),
        updatedAt: Number(new Date()),
      };
      vi.spyOn(service, 'create').mockResolvedValueOnce(newUser);
      expect(
        await controller.create({
          login: 'TEST_USER1',
          password: 'pass',
          role: UserRole.VIEWER,
        }),
      ).toEqual(newUser);
    });

    it('should throw error when user service failed', async () => {
      vi.spyOn(service, 'create').mockRejectedValueOnce(
        new PrismaClientKnownRequestError('message', {
          code: 'P2002',
          clientVersion: '1',
        }),
      );
      await expect(
        controller.create({
          login: 'TEST_USER1',
          password: 'pass',
          role: UserRole.VIEWER,
        }),
      ).rejects.toThrow(
        new HttpException(BAD_REQUEST_MESSAGE, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('update user', () => {
    it('should return updated user when updated without errors', async () => {
      const result = {
        id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
        login: 'TEST_USER1',
        role: UserRole.VIEWER,
        createdAt: Number(new Date()),
        updatedAt: Number(new Date()),
      };
      const updUser = {
        id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
        oldPassword: '54321',
        newPassword: '12345',
      };
      vi.spyOn(service, 'update').mockResolvedValue(result);
      expect(
        await controller.update(
          { id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed' },
          updUser,
        ),
      ).toEqual(result);
    });

    it('should throw error when password incorrect', async () => {
      const updUser = {
        id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
        oldPassword: '54321',
        newPassword: '12345',
      };
      const error = {
        error: true,
        message: PASSWORD_INCORRECT,
        field: 'oldPassword',
      };
      vi.spyOn(service, 'update').mockResolvedValue(error);
      await expect(() =>
        controller.update(
          { id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed' },
          updUser,
        ),
      ).rejects.toThrow(new HttpException(error.message, HttpStatus.FORBIDDEN));
    });

    it('should throw error when user not found', async () => {
      const updUser = {
        id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
        oldPassword: '54321',
        newPassword: '12345',
      };
      const error = {
        error: true,
        message: USER_NOT_FOUND,
        field: 'id',
      };
      vi.spyOn(service, 'update').mockResolvedValue(error);
      await expect(() =>
        controller.update(
          { id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed' },
          updUser,
        ),
      ).rejects.toThrow(new HttpException(error.message, HttpStatus.NOT_FOUND));
    });
  });

  describe('delete user', () => {
    it('should return deleted user when deleted', async () => {
      const result = {
        id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
        login: 'TEST_USER1',
        role: UserRole.VIEWER,
        createdAt: Number(new Date()),
        updatedAt: Number(new Date()),
      };

      vi.spyOn(service, 'remove').mockResolvedValue(result);
      expect(
        await controller.remove({ id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed' }),
      ).toEqual(result);
    });

    it('should throw error when user not found', async () => {
      vi.spyOn(service, 'remove').mockRejectedValue(
        new Error(NOT_FOUND_MESSAGE),
      );
      await expect(() =>
        controller.remove({ id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed' }),
      ).rejects.toThrow(
        new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND),
      );
    });
  });
});
