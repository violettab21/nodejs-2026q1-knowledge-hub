import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersStorage } from './storage/users.storage';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'IUsersStorage', useClass: UsersStorage },
    PrismaService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
