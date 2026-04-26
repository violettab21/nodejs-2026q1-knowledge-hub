import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserParams, UsersQueryParams } from './dto/user-params.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponse } from './entities/user.entity';
import {
  BAD_REQUEST_MESSAGE,
  FORBIDDEN_MESSAGE,
  NOT_FOUND_MESSAGE,
} from '../constants/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Roles } from '../auth/auth.roles';
import { UserRole } from '../../generated/prisma/enums';
import { PermissionsUsersGuard } from '../auth/guards/usersPermissions.guard';
import { ValidationError } from 'src/errors/ValidationError';
import { NotFoundError } from 'src/errors/NotFoundError';
import { ForbiddenError } from 'src/errors/ForbiddenError';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @Roles([UserRole.ADMIN])
  @ApiResponse({
    status: 201,
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ValidationError('User already exists');
      } else throw err;
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [UserResponse],
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async findAll(@Query() params?: UsersQueryParams) {
    const { page, limit, sortBy, order } = params;
    return await this.usersService.findAll(page, limit, sortBy, order);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: UserResponse,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async findOne(@Param() params: UserParams) {
    const user = await this.usersService.findOne(params.id);
    if (user) {
      return user;
    }
    throw new NotFoundError(`User with id ${params.id} is not found`);
  }

  @Put(':id')
  @Roles([UserRole.ADMIN, UserRole.EDITOR])
  @UseGuards(PermissionsUsersGuard)
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    type: UserResponse,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 403, description: FORBIDDEN_MESSAGE })
  async update(
    @Param() params: UserParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(params.id, updateUserDto);
    if ('error' in user) {
      if (user.field === 'oldPassword') {
        throw new ForbiddenError(user.message);
      }
      throw new NotFoundError(`User with id ${params.id} is not found`);
    }

    return user;
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN, UserRole.EDITOR])
  @UseGuards(PermissionsUsersGuard)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async remove(@Param() params: UserParams) {
    try {
      const user = await this.usersService.remove(params.id);
      return user;
    } catch (err) {
      if (err instanceof Error && err.message === NOT_FOUND_MESSAGE) {
        throw new NotFoundError(`User with id ${params.id} is not found`);
      }
    }
  }
}
