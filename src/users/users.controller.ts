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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserParams } from './dto/user-params.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: UserParams) {
    const user = this.usersService.findOne(params.id);
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  update(@Param() params: UserParams, @Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.update(params.id, updateUserDto);
    if ('error' in user) {
      if (user.code === 'password') {
        throw new HttpException(user.errorMessage, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(user.errorMessage, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Delete(':id')
  remove(@Param() params: UserParams) {
    const user = this.usersService.remove(params.id);
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
