import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersStorage } from './storage/users.storage';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'IUsersStorage', useClass: UsersStorage },
  ],
  exports: [UsersService],
})
export class UsersModule {}
