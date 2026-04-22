import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { IUsersStorage } from './interfaces/users.interface';
import { UserRole } from '../../generated/prisma/enums';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { PASSWORD_INCORRECT, USER_NOT_FOUND } from './constants/constants';

describe('UsersService', () => {
  let service: UsersService;
  const newTestUser = {
    login: 'TEST_USER1',
    password: '12345',
  };

  const updatedTestUser = {
    oldPassword: 'hashed password1',
    newPassword: 'newPassword',
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
    updateUser: vi
      .fn()
      .mockImplementation((id, updateUserDto: UpdateUserDto) => {
        const user = users.find((user) => user.id === id);
        return {
          ...user,
        };
      }),
    removeUser: vi.fn().mockImplementation((id) => {
      const user = users.find((user) => user.id === id);
      return {
        ...user,
      };
    }),
  } as vi.mocked<IUsersStorage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'IUsersStorage',
          useValue: mockedUsersStorage,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all users', async () => {
    const receivedUsers = await service.findAll();
    expect(receivedUsers.length).toBe(users.length);
    expect(mockedUsersStorage.getUsers).toHaveBeenCalled();
    expect('password' in receivedUsers[0]).toBe(false);
  });

  it('should get one user by id', async () => {
    const receivedUser = await service.findOne(
      '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
    );
    expect(mockedUsersStorage.getUserById).toHaveBeenCalledWith(
      '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
    );
    expect(receivedUser.login).toEqual(users[0].login);
    expect('password' in receivedUser).toBe(false);
  });

  it('should create user', async () => {
    vi.spyOn(bcrypt, 'hash').mockImplementationOnce(
      async (password: string) => `hashed${password}`,
    );
    const newUser = await service.create(newTestUser);
    expect(mockedUsersStorage.createUser).toHaveBeenCalledWith({
      ...newTestUser,
      password: `hashed${newTestUser.password}`,
    });
    expect(newUser.login).toEqual(newTestUser.login);
    expect('password' in newUser).toBe(false);
    expect('id' in newUser).toBe(true);
    expect('role' in newUser).toBe(true);
    expect(typeof newUser.createdAt).toBe('number');
    expect(typeof newUser.updatedAt).toBe('number');
  });

  it('should update user', async () => {
    vi.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => true);

    const updUser = await service.update(
      '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
      updatedTestUser,
    );
    expect(mockedUsersStorage.updateUser).toHaveBeenCalledWith(
      '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
      updatedTestUser,
    );
    expect('password' in updUser).toBe(false);
    expect('id' in updUser).toBe(true);
    expect('role' in updUser).toBe(true);
    expect(typeof updUser.createdAt).toBe('number');
    expect(typeof updUser.updatedAt).toBe('number');
  });

  it('should return error is password is not correct', async () => {
    vi.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false);

    const updUser = await service.update(
      '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
      updatedTestUser,
    );
    expect('error' in updUser).toBe(true);
    expect('message' in updUser).toBe(true);
    expect(updUser.message).toBe(PASSWORD_INCORRECT);
  });

  it('should return error is user is not found', async () => {
    mockedUsersStorage.getUserById.mockResolvedValueOnce(null);

    const updUser = await service.update(
      '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
      updatedTestUser,
    );
    expect('error' in updUser).toBe(true);
    expect('message' in updUser).toBe(true);
    expect(updUser.message).toBe(USER_NOT_FOUND);
  });

  it('should delete user', async () => {
    const delUser = await service.remove(
      '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
    );
    expect(mockedUsersStorage.removeUser).toHaveBeenCalledWith(
      '9121d4bb-3e75-41da-9863-5ac7b1dfcfed',
    );
    expect('password' in delUser).toBe(false);
    expect('id' in delUser).toBe(true);
    expect('role' in delUser).toBe(true);
  });
});
