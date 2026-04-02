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
  getUsers(): IUserResponse[];
  getUserById(id: string): IUserResponse;
  createUser(createUserDto: CreateUserDto): IUserResponse;
  updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): IUserResponse | { code: string; error: boolean; errorMessage: string };
  removeUser(id: string): IUserResponse | null;
}
