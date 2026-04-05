import { Injectable } from '@nestjs/common';
import { IUsersStorage } from '../interfaces/users.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { randomUUID } from 'node:crypto';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/roles.enum';

@Injectable()
export class UsersStorage implements IUsersStorage {
  private users: User[] = [];

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
