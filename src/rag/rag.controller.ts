import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { RagService } from './rag.service';
import { ReindexRequestDTO } from './dto/reindex-request.dto';
import { RagSearchRequestDTO } from './dto/search.dto';
import { RagChatRequestDTO } from './dto/rag-chat-request.dto';

@Controller('ai/rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('index')
  @HttpCode(200)
  index(@Body() reindexDTO: ReindexRequestDTO) {
    return this.ragService.buildVector(reindexDTO);
  }
  @Post('search')
  search(@Body() searchDto: RagSearchRequestDTO) {
    return this.ragService.search(searchDto);
  }
  @Post('chat')
  chat(@Body() chatDTO: RagChatRequestDTO) {
    return this.ragService.chat(chatDTO);
  }
}
