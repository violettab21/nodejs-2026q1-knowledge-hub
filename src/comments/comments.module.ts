import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsStorage } from './storage/comments.storage';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService,   { provide: 'ICommentsStorage', useClass: CommentsStorage },],
})
export class CommentsModule {}
