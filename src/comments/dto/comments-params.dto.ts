import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CommentsParams {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  id: string;
}

export class CommentsQueryParams {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  articleId: string;
}
