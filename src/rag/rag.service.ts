import { Injectable } from '@nestjs/common';
import { ReindexRequestDTO } from './dto/reindex-request.dto';
import { RagSearchRequestDTO } from './dto/search.dto';
import { RagChatRequestDTO } from './dto/rag-chat-request.dto';

@Injectable()
export class RagService {
  buildVector(reindexDTO: ReindexRequestDTO) {
    return 'This action builds or refresh vector';
  }

  search(searchDto: RagSearchRequestDTO) {
    return `This action search vector`;
  }

  chat(chatDTO: RagChatRequestDTO) {
    return `This action returns a chat result`;
  }
}
