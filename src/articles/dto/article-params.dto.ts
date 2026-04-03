import { IsUUID } from 'class-validator';

export class ArticleParams {
  @IsUUID()
  id: string;
}
