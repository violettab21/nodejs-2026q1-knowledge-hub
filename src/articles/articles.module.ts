import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticlesStorage } from './storage/articles.storage';

@Module({
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    { provide: 'IArticlesStorage', useClass: ArticlesStorage },
  ],
})
export class ArticlesModule {}
