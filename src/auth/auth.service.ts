import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IUsersStorage } from 'src/users/interfaces/users.interface';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { StringValue } from 'ms';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUsersStorage') private storage: IUsersStorage,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(login: string, password: string) {
    const user = await this.storage.getUserByLogin(login);
    if (!user) {
      return null;
    }
    if (user.password === password) {
      const payload = { sub: user.id, login: user.login, role: user.role };
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
      const newUser = await this.usersService.create({ login, password });
      return newUser;
    }

    return null;
  }

  async refresh(refreshToken: string) {
    try {
      const validateRefresh: {
        sub: string;
        login: string;
        role: UserRole;
      } = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
        ignoreExpiration: false,
      });
      if (validateRefresh) {
        const { sub, login, role } = validateRefresh;
        const accessToken = await this.jwtService.signAsync(
          { sub, login, role },
          {
            secret: process.env.JWT_SECRET,
            expiresIn: `${process.env.JWT_ACCESS_TTL}` as StringValue,
          },
        );
        const refreshToken = await this.jwtService.signAsync(
          { sub, login, role },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: `${process.env.JWT_REFRESH_TTL}` as StringValue,
          },
        );
        return {
          accessToken,
          refreshToken,
        };
      }
    } catch (err) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }
}
