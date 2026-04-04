import { IsUUID } from 'class-validator';

export class CommentsParams {
  @IsUUID()
  id: string;
}


export class CommentsQueryParams {
  @IsUUID()
  articleId: string;
}