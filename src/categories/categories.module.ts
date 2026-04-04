import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesStorage } from './storage/categories.storage';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: 'ICategoriesStorage', useClass: CategoriesStorage },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
