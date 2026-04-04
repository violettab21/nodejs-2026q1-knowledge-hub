import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsStorage } from './storage/comments.storage';
import { UsersModule } from 'src/users/users.module';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [UsersModule, ArticlesModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    { provide: 'ICommentsStorage', useClass: CommentsStorage },
  ],
})
export class CommentsModule {}
