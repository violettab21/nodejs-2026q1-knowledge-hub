import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '../enums/article.enum';

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
