import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { ArticlesModule } from 'src/articles/articles.module';
import { VectorDBService } from './vectorDB.service';
import { ChatHistoryService } from './chatHistory.service';

@Module({
  imports: [ArticlesModule],
  controllers: [RagController],
  providers: [RagService, VectorDBService, ChatHistoryService],
})
export class RagModule {}
