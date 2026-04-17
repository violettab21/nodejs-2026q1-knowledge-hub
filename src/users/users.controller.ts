import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
  Query,
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
  INTERNAL_ERROR_MESSAGE,
  NOT_FOUND_MESSAGE,
} from 'src/constants/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UserRole } from 'generated/prisma/enums';
import { Roles } from 'src/auth/auth.roles';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
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
        throw new HttpException(BAD_REQUEST_MESSAGE, HttpStatus.BAD_REQUEST);
      } else
        throw new HttpException(
          INTERNAL_ERROR_MESSAGE,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @Roles([UserRole.ADMIN])
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
        throw new HttpException(user.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(user.message, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN])
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
        throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
    }
  }
}
