import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { HttpModule } from '@nestjs/axios';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [HttpModule, ArticlesModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
