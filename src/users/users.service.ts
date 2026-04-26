import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersStorage } from './interfaces/users.interface';
import { UserResponse } from './entities/user.entity';
import { getPaginationData } from '../helpers/pagination/pagination';
import { sortData } from '../helpers/sorting/sorting';
import { PASSWORD_INCORRECT, USER_NOT_FOUND } from './constants/constants';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace';
import { NOT_FOUND_MESSAGE } from '../constants/constants';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

@Injectable()
export class UsersService {
  constructor(@Inject('IUsersStorage') private storage: IUsersStorage) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { password, ...props } = createUserDto;
    const hash = await bcrypt.hash(password, Number(process.env.CRYPT_SALT));
    const user = this.storage.createUser({ ...props, password: hash });
    const { id, login, role, createdAt, updatedAt } = await user;
    return {
      id,
      login,
      role,
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };
  }

  async findAll(
    page?: number,
    limit?: number,
    sortBy?: string,
    order?: 'asc' | 'desc',
  ) {
    const users = await this.storage.getUsers();
    let usersWithoutPass = users.map(
      ({ id, login, role, createdAt, updatedAt }) => {
        return {
          id,
          login,
          role,
          createdAt: Number(createdAt),
          updatedAt: Number(updatedAt),
        };
      },
    );
    if (sortBy && order) {
      usersWithoutPass = sortData(sortBy, order, usersWithoutPass);
    }

    if (page && limit) {
      return getPaginationData(+page, +limit, usersWithoutPass);
    }
    return usersWithoutPass;
  }

  async findOne(id: string) {
    const user = await this.storage.getUserById(id);
    if (user) {
      const { id, login, role, createdAt, updatedAt } = user;
      return {
        id,
        login,
        role,
        createdAt: Number(createdAt),
        updatedAt: Number(updatedAt),
      };
    }
    return null;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.storage.getUserById(id);
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(
        updateUserDto.oldPassword,
        user.password,
      );
      if (isPasswordCorrect) {
        const updatedUser = await this.storage.updateUser(id, updateUserDto);
        const { id: userId, login, role, createdAt, updatedAt } = updatedUser;
        return {
          id: userId,
          login,
          role,
          createdAt: Number(createdAt),
          updatedAt: Number(updatedAt),
        };
      }
      return {
        error: true,
        message: PASSWORD_INCORRECT,
        field: 'oldPassword',
      };
    }
    return {
      error: true,
      message: USER_NOT_FOUND,
      field: 'id',
    };
  }

  async remove(id: string) {
    try {
      const user = await this.storage.removeUser(id);

      const { id: userId, login, role, createdAt, updatedAt } = user;
      return {
        id: userId,
        login,
        role,
        createdAt: Number(createdAt),
        updatedAt: Number(updatedAt),
      };
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new Error(NOT_FOUND_MESSAGE);
      }
    }
  }
}
