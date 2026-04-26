import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IUsersStorage } from 'src/users/interfaces/users.interface';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../generated/prisma/enums';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import bcrypt from 'bcryptjs';
import { UsersService } from '../../src/users/users.service';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ForbiddenError } from '../errors/ForbiddenError';
import {
  INVALID_CREDENTIALS,
  INVALID_REFRESH_TOKEN,
} from '../constants/constants';

describe('AuthService', () => {
  let service: AuthService;

  const newSignUpUser = {
    login: 'LOGIN',
    password: 'PASSWORD',
  };

  const users = [
    {
      id: '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
      login: 'TEST_USER1',
      password: 'hashed password1',
      role: UserRole.VIEWER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '9121d4bb-3e75-41da-9863-4ac7b1dfcfed',
      login: 'TEST_USER2',
      password: 'hashed password2',
      role: UserRole.EDITOR,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockedUsersStorage = {
    getUsers: vi.fn().mockImplementation(() => users),
    getUserById: vi
      .fn()
      .mockImplementation((userId) => users.find((user) => user.id === userId)),
    getUserByLogin: vi
      .fn()
      .mockImplementation((login) =>
        users.find((user) => user.login === login),
      ),
    createUser: vi.fn().mockImplementation((createUserDTO: CreateUserDto) => {
      return {
        id: '0613c29b-14ca-4ef4-91a8-5a055fd5ddcb',
        ...createUserDTO,
        role: createUserDTO.role || UserRole.VIEWER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
    updateUser: vi.fn(),
    removeUser: vi.fn().mockImplementation((id) => {
      const user = users.find((user) => user.id === id);
      return {
        ...user,
      };
    }),
  } as vi.mocked<IUsersStorage>;

  const mockedJWTService = {
    signAsync: vi.fn(),
    verifyAsync: vi.fn(),
  };

  const mockedUsersService = {
    create: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it('should login user when credentials are valid', async () => {
    const testUser = users[0];
    const spy = vi
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce(async () => true);
    const loginUser = await service.login(testUser.login, testUser.password);
    expect('accessToken' in loginUser).toBe(true);
    expect('refreshToken' in loginUser).toBe(true);
    spy.mockRestore();
  });

  it('should throw error when no user found', async () => {
    const testUser = users[0];
    mockedUsersStorage.getUserByLogin.mockResolvedValueOnce(null);
    const spy = vi
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce(async () => true);

    await expect(
      service.login(testUser.login, testUser.password),
    ).rejects.toThrow(
      new UnauthorizedError(`User with login ${testUser.login} not found`),
    );
    spy.mockRestore();
  });

  it('should throw error when credentials are incorrect', async () => {
    const testUser = users[0];
    const spy = vi
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce(async () => false);

    await expect(
      service.login(testUser.login, testUser.password),
    ).rejects.toThrow(new UnauthorizedError(INVALID_CREDENTIALS));
    spy.mockRestore();
  });

  it('should sign up user', async () => {
    const mockedRes = {
      id: 'c3d0d101-3507-4561-aa88-0d276fbb8a01',
      ...newSignUpUser,
      role: UserRole.VIEWER,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
    };

    mockedUsersService.create.mockResolvedValue(mockedRes);
    const registeredUser = await service.signUp(
      newSignUpUser.login,
      newSignUpUser.password,
    );
    expect(registeredUser).toEqual(mockedRes);
  });

  it('should return null if sign up existing user', async () => {
    const testUser = users[0];
    const registeredUser = await service.signUp(
      testUser.login,
      testUser.password,
    );
    expect(registeredUser).toEqual(null);
  });

  it('should refresh tokens if valid refresh token provided', async () => {
    const refreshToken = 'sometoken123';
    mockedJWTService.verifyAsync.mockResolvedValueOnce(true);
    const refreshResult = await service.refresh(refreshToken);
    expect('accessToken' in refreshResult).toBe(true);
    expect('refreshToken' in refreshResult).toBe(true);
  });

  it('should throw error if invalid refresh token provided', async () => {
    const refreshToken = 'invalid token';
    mockedJWTService.verifyAsync.mockRejectedValueOnce(new Error());

    await expect(service.refresh(refreshToken)).rejects.toThrow(
      new ForbiddenError(INVALID_REFRESH_TOKEN),
    );
  });
});
