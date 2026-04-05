import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersStorage } from './storage/users.storage';
import { CommentsModule } from 'src/comments/comments.module';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [forwardRef(() => CommentsModule), forwardRef(() => ArticlesModule)],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'IUsersStorage', useClass: UsersStorage },
  ],
  exports: [UsersService],
})
export class UsersModule {}
