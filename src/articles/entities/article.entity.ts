import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from 'generated/prisma/enums';

export class Article {
  @ApiProperty({
    type: String,
    required: true,
  })
  id: string;
  title: string;
  content: string;
  status?: ArticleStatus;
  authorId: string | null;
  categoryId: string | null;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}
