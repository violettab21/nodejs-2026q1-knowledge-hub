import { IsDefined, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsDefined()
  content: string;
  @IsDefined()
  @IsUUID()
  articleId: string;
  @IsOptional()
  @IsUUID()
  authorId: string | null;
}
