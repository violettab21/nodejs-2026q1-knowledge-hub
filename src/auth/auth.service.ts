import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUsersStorage } from 'src/users/interfaces/users.interface';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUsersStorage') private storage: IUsersStorage,
    private jwtService: JwtService,
  ) {}

  async login(login: string, password: string) {
    const user = await this.storage.getUserByLogin(login);
    if (!user) {
      return null;
    }
    if (user.password === password) {
      const payload = { sub: user.id, login: user.login };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: `${process.env.JWT_ACCESS_TTL}` as StringValue,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: `${process.env.JWT_REFRESH_TTL}` as StringValue,
      });
      return {
        accessToken,
        refreshToken,
      };
    }
    throw new UnauthorizedException();
  }

  async signUp(login: string, password: string) {
    const user = await this.storage.getUserByLogin(login);
    if (!user) {
      return null;
    }
    if (user.password === password) {
      const payload = { sub: user.id, login: user.login };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: `${process.env.JWT_ACCESS_TTL}` as StringValue,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: `${process.env.JWT_REFRESH_TTL}` as StringValue,
      });
      return {
        accessToken,
        refreshToken,
      };
    }
    throw new UnauthorizedException();
  }
}
