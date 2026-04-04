import { IsDefined, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsDefined()
  content: string;
  @IsDefined()
  @IsUUID()
  articleId: string;
}
