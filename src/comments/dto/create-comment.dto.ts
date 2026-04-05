import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'Great Article',
    type: String,
    required: true,
  })
  @IsDefined()
  content: string;
  @ApiProperty({
    description: 'articleId',
    example: '61ff1183-ef8f-4e21-b9e5-01f7463ad139',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsUUID()
  articleId: string;
  @ApiProperty({
    description: 'authorId',
    example: '61ff1183-ef8f-4e21-b9e5-01f7463ad139',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  authorId: string | null;
}
