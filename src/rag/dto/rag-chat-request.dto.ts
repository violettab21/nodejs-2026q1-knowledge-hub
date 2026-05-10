import { IsDefined, IsOptional, IsString, IsUUID } from 'class-validator';

export class RagChatRequestDTO {
  @IsDefined()
  @IsString()
  question: string;
  @IsOptional()
  @IsString()
  conversationId?: string;
}

export class ChatParams {
  @IsUUID()
  conversationId: string;
}
