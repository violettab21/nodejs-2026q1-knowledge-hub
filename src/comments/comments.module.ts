import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsStorage } from './storage/comments.storage';

import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CommentsController],
  providers: [
    CommentsService,
    { provide: 'ICommentsStorage', useClass: CommentsStorage },
    PrismaService,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
