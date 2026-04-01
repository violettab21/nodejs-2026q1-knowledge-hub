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
    return this.users.map(({ password, ...rest }) => rest);
  }

  getUserById(id: string) {
    const foundUser = this.users.find((user) => user.id === id);
    if (foundUser) {
      const { password, ...rest } = foundUser;
      return rest;
    }
    return null;
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
    const { password, ...rest } = newUser;
    this.users.push(newUser);
    return rest;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = this.users.find((user) => user.id === id);
    if (updatedUser) {
      if (updatedUser.password === updateUserDto.oldPassword) {
        updatedUser.password === updateUserDto.newPassword;
        updatedUser.updatedAt = Date.now();
        const { password, ...rest } = updatedUser;
        return rest;
      } else {
        return null;
      }
    }
    return null;
  }

  removeUser(id: string) {
    const deletedUser = this.users.find((user) => user.id === id);
    if (deletedUser) {
      this.users = this.users.filter((user) => user.id !== id);
      const { password, ...rest } = deletedUser;
      return rest;
    }
    return null;
  }
}
