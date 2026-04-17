import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/loginDTO.dto';
import { BAD_REQUEST_MESSAGE } from 'src/constants/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDTO: LoginDTO) {
    try {
      const user = await this.authService.login(
        loginDTO.login,
        loginDTO.password,
      );
      if (user) {
        return user;
      }
      throw new HttpException(BAD_REQUEST_MESSAGE, HttpStatus.BAD_REQUEST);
    } catch (err) {
      throw err;
    }
  }
}
