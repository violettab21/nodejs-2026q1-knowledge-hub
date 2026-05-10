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
  async index(@Body() reindexDTO: ReindexRequestDTO) {
    return await this.ragService.buildVector(reindexDTO);
  }
  @Post('search')
  @HttpCode(200)
  async search(@Body() searchDto: RagSearchRequestDTO) {
    return await this.ragService.search(searchDto);
  }
  @Post('chat')
  @HttpCode(200)
  async chat(@Body() chatDTO: RagChatRequestDTO) {
    return this.ragService.chat(chatDTO);
  }
}
