import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsParams, CommentsQueryParams } from './dto/comments-params.dto';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    const newComment = this.commentsService.create(createCommentDto);
    if (newComment) {
      return newComment;
    }
    if ('message' in newComment) {
      throw new HttpException(
        newComment?.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Get()
  findAll(@Query() params: CommentsQueryParams) {
    return this.commentsService.findAll(params.articleId);
  }

  @Delete(':id')
  remove(@Param() params: CommentsParams) {
    return this.commentsService.remove(params.id);
  }
}
