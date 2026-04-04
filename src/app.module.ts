import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, ArticlesModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
