import { Injectable } from '@nestjs/common';
import { IUser, IUsersStorage } from '../interfaces/users.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersStorage implements IUsersStorage {
  private users: IUser[] = [];

  constructor() {}

  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  createUser(createUserDto: CreateUserDto) {
    const { role, ...props } = createUserDto;
    const newUser: IUser = {
      id: randomUUID(),
      ...props,
      role: role || 'viewer',
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
