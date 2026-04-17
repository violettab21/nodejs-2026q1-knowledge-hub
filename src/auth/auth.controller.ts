import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BAD_REQUEST_MESSAGE } from 'src/constants/constants';
import { SignUpDTO } from './dto/signUpDTO.dto';
import { RefreshDTO } from './dto/refreshDTO.dto';
import { Public } from './auth.public';
import { LoginDTO } from './dto/loginDTO.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
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

  @Post('signUp')
  @HttpCode(201)
  @Public()
  async signUp(@Body() signUpDTO: SignUpDTO) {
    try {
      const user = await this.authService.signUp(
        signUpDTO.login,
        signUpDTO.password,
      );
      if (user) {
        return user;
      }
      throw new HttpException(BAD_REQUEST_MESSAGE, HttpStatus.BAD_REQUEST);
    } catch (err) {
      throw err;
    }
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  async refresh(@Body() refreshDTO: RefreshDTO) {
    try {
      const refresh = await this.authService.refresh(refreshDTO.refreshToken);
      return refresh;
    } catch (err) {
      throw err;
    }
  }
}
