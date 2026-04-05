import { ApiProperty } from '@nestjs/swagger';

export class Comment {
  @ApiProperty({
    description: 'User Id (UID)',
    example: 'e30c4ac7-5be6-410a-ac61-c59e3eb5ea4f',
    type: String,
    required: true,
  })
  id: string;
  content: string;
  articleId: string;
  authorId: string | null;
  createdAt: number;
}
