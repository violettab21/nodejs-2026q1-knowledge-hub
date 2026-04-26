import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesStorage } from './storage/categories.storage';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: 'ICategoriesStorage', useClass: CategoriesStorage },
    PrismaService,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
