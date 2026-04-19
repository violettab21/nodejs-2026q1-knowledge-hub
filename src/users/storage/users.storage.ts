import { Injectable } from '@nestjs/common';
import { IUsersStorage } from '../interfaces/users.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from 'generated/prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

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

  async getUserByLogin(login: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { role, password, ...props } = createUserDto;
    const hash = await bcrypt.hash(password, Number(process.env.CRYPT_SALT));
    const newUser = await this.prisma.user.create({
      data: {
        ...props,
        password: hash,
        role: role || UserRole.VIEWER,
      },
    });
    return newUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        password: updateUserDto.newPassword,
        updatedAt: new Date(Date.now()),
      },
    });
  }

  async removeUser(id: string) {
    return await this.prisma.user.delete({
      where: { id: id },
    });
  }
}
