import { User } from 'generated/prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUsersStorage {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  getUserByLogin(login: string): Promise<User>;
  createUser(createUserDto: CreateUserDto): Promise<User>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  removeUser(id: string): Promise<User>;
}
