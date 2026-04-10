import { Injectable } from '@nestjs/common';
import { IUsersStorage } from '../interfaces/users.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from 'generated/prisma/client';

@Injectable()
export class UsersStorage implements IUsersStorage {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { role, ...props } = createUserDto;
    const newUser = await this.prisma.user.create({
      data: {
        ...props,
        role: role || UserRole.VIEWER,
      },
    });
    return newUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    /* const updatedUser = this.getUserById(id);
    if (updatedUser) {
      updatedUser.password = updateUserDto.newPassword;
      updatedUser.updatedAt = Date.now();
      return updatedUser;
    }*/
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        password: updateUserDto.newPassword,
        updatedAt: new Date(Date.now()),
      },
    });
  }

  async removeUser(id: string) {
    /* const deletedUser = this.getUserById(id);
    if (deletedUser) {
      this.users = this.users.filter((user) => user.id !== id);
      return deletedUser;
    }
    return null;
  }*/
    return await this.prisma.user.delete({
      where: { id: id },
    });
  }
}
