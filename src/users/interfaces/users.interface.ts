import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUser {
  id: string;
  login: string;
  password: string;
  role?: 'admin' | 'editor' | 'viewer';
  createdAt: number;
  updatedAt: number;
}

export type IUserResponse = Omit<IUser, 'password'>;

export interface IUsersStorage {
  getUsers(): IUser[];
  getUserById(id: string): IUser;
  createUser(createUserDto: CreateUserDto): IUser;
  updateUser(id: string, updateUserDto: UpdateUserDto): IUser;
  removeUser(id: string): IUser | null;
}
