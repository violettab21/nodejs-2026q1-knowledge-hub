import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersStorage } from './interfaces/users.interface';
import { CommentsService } from 'src/comments/comments.service';
import { ArticlesService } from 'src/articles/articles.service';
import { UserResponse } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersStorage') private storage: IUsersStorage,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
    @Inject(forwardRef(() => ArticlesService))
    private readonly articlesService: ArticlesService,
  ) {}

  create(createUserDto: CreateUserDto): UserResponse {
    const user = this.storage.createUser(createUserDto);
    const { id, login, role, createdAt, updatedAt } = user;
    return {
      id,
      login,
      role,
      createdAt,
      updatedAt,
    };
  }

  findAll() {
    const users = this.storage.getUsers();

    return users.map(({ id, login, role, createdAt, updatedAt }) => {
      return {
        id,
        login,
        role,
        createdAt,
        updatedAt,
      };
    });
  }

  findOne(id: string) {
    const user = this.storage.getUserById(id);
    if (user) {
      const { id, login, role, createdAt, updatedAt } = user;
      return {
        id,
        login,
        role,
        createdAt,
        updatedAt,
      };
    }
    return null;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.storage.getUserById(id);
    if (user) {
      if (user.password === updateUserDto.oldPassword) {
        const updatedUser = this.storage.updateUser(id, updateUserDto);
        const { id: userId, login, role, createdAt, updatedAt } = updatedUser;
        return {
          id: userId,
          login,
          role,
          createdAt,
          updatedAt,
        };
      }
      return {
        error: true,
        message: 'Old password is incorrect',
        field: 'oldPassword',
      };
    }
    return {
      error: true,
      message: 'User not found',
      field: 'id',
    };
  }

  remove(id: string) {
    const user = this.storage.removeUser(id);

    if (user) {
      const { id: userId, login, role, createdAt, updatedAt } = user;
      this.commentsService.removeUserComments(userId);
      this.articlesService.cleanAuthorId(userId);
      return {
        id: userId,
        login,
        role,
        createdAt,
        updatedAt,
      };
    }
    return null;
  }
}
