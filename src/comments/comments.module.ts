import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsStorage } from './storage/comments.storage';
import { UsersModule } from 'src/users/users.module';
import { ArticlesModule } from 'src/articles/articles.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => ArticlesModule)],

  controllers: [CommentsController],
  providers: [
    CommentsService,
    { provide: 'ICommentsStorage', useClass: CommentsStorage },
    PrismaService,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
