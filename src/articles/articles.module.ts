import { forwardRef, Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticlesStorage } from './storage/articles.storage';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CommentsModule } from 'src/comments/comments.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    { provide: 'IArticlesStorage', useClass: ArticlesStorage },
    PrismaService,
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
