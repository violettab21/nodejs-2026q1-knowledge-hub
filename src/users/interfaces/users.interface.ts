import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUsersStorage {
  getUsers(): User[];
  getUserById(id: string): User;
  createUser(createUserDto: CreateUserDto): User;
  updateUser(id: string, updateUserDto: UpdateUserDto): User;
  removeUser(id: string): User | null;
}
