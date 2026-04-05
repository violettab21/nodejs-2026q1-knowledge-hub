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
  NOT_FOUND_MESSAGE,
} from 'src/constants/constants';

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [UserResponse],
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  findAll(@Query() params?: UsersQueryParams) {
    const { page, limit, sortBy, order } = params;
    return this.usersService.findAll(page, limit, sortBy, order);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: UserResponse,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  findOne(@Param() params: UserParams) {
    const user = this.usersService.findOne(params.id);
    if (user) {
      return user;
    }
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    type: UserResponse,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 403, description: FORBIDDEN_MESSAGE })
  update(@Param() params: UserParams, @Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.update(params.id, updateUserDto);
    if ('error' in user) {
      if (user.field === 'oldPassword') {
        throw new HttpException(user.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(user.message, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  remove(@Param() params: UserParams) {
    const user = this.usersService.remove(params.id);
    if (user) {
      return user;
    }
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }
}
