import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticlesStorage } from './storage/articles.storage';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [UsersModule, CategoriesModule],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    { provide: 'IArticlesStorage', useClass: ArticlesStorage },
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
