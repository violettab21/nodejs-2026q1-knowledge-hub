import { Injectable } from '@nestjs/common';
import { IUsersStorage } from '../interfaces/users.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { randomUUID } from 'node:crypto';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/roles.enum';

@Injectable()
export class UsersStorage implements IUsersStorage {
  private users: User[] = [
    {
      id: '22488770-cefe-4779-9b09-b3092b1827aa',
      login: 'user1',
      password: '1234',
      role: UserRole.Admin,
      createdAt: 1775414842770,
      updatedAt: 1775414842770,
    },
    {
      id: 'e59bfbc9-8047-4051-a4d7-785ddafd0c30',
      login: 'user2',
      password: '1234',
      role: UserRole.Admin,
      createdAt: 1775414861257,
      updatedAt: 1775414861257,
    },
    {
      id: 'f4f8b8f5-95ae-4fa7-803f-6844f34719f4',
      login: 'user3',
      password: '1234',
      role: UserRole.Admin,
      createdAt: 1775414884968,
      updatedAt: 1775414884968,
    },
    {
      id: 'd132a160-91f2-45fb-b5c6-809be78fbd50',
      login: 'user4',
      password: '1234',
      role: UserRole.Admin,
      createdAt: 1775414904107,
      updatedAt: 1775414904107,
    },
    {
      id: '01c9800c-07ea-4d59-bb04-015565e048cb',
      login: 'user5',
      password: '1234',
      role: UserRole.Admin,
      createdAt: 1775414910813,
      updatedAt: 1775414960611,
    },
  ];

  constructor() {}

  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  createUser(createUserDto: CreateUserDto) {
    const { role, ...props } = createUserDto;
    const newUser: User = {
      id: randomUUID(),
      ...props,
      role: role || UserRole.Viewer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = this.getUserById(id);
    if (updatedUser) {
      updatedUser.password = updateUserDto.newPassword;
      updatedUser.updatedAt = Date.now();
      return updatedUser;
    }
    return null;
  }

  removeUser(id: string) {
    const deletedUser = this.getUserById(id);
    if (deletedUser) {
      this.users = this.users.filter((user) => user.id !== id);
      return deletedUser;
    }
    return null;
  }
}
