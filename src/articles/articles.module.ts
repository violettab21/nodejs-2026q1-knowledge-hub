import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticlesStorage } from './storage/articles.storage';

import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    { provide: 'IArticlesStorage', useClass: ArticlesStorage },
    PrismaService,
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
