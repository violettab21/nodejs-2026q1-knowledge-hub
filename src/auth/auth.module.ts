import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersStorage } from 'src/users/storage/users.storage';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { StringValue } from 'ms';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: `${process.env.JWT_ACCESS_TTL}` as StringValue,
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: 'IUsersStorage', useClass: UsersStorage },
    PrismaService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
