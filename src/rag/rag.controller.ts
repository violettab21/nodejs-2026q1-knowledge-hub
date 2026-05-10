import { Controller, Post, Body, HttpCode, Get, Param } from '@nestjs/common';
import { RagService } from './rag.service';
import { ReindexRequestDTO } from './dto/reindex-request.dto';
import { RagSearchRequestDTO } from './dto/search.dto';
import { ChatParams, RagChatRequestDTO } from './dto/rag-chat-request.dto';
import { NotFoundError } from 'src/errors/NotFoundError';

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

  @Get('chat/:conversationId/history')
  getChatHistory(@Param() params: ChatParams) {
    const history = this.ragService.getChatHistory(params.conversationId);
    if (history) {
      return history;
    }
    throw new NotFoundError(
      `Chat with conversationId ${params.conversationId} is not found`,
    );
  }
}
