import { IsDefined, IsOptional, IsString } from 'class-validator';

export class RagChatRequestDTO {
  @IsDefined()
  @IsString()
  question: string;
  @IsOptional()
  @IsString()
  conversationId?: string;
}
