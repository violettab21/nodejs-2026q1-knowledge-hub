import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersStorage } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(@Inject('IUsersStorage') private storage: IUsersStorage) {}

  create(createUserDto: CreateUserDto) {
    return this.storage.createUser(createUserDto);
  }

  findAll() {
    return this.storage.getUsers();
  }

  findOne(id: string) {
    return this.storage.getUserById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.storage.updateUser(id, updateUserDto);
  }

  remove(id: string) {
    return this.storage.removeUser(id);
  }
}
