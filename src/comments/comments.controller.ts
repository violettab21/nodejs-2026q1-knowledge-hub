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
  HttpCode,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsParams, CommentsQueryParams } from './dto/comments-params.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

@ApiTags('Comment')
@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createCommentDto: CreateCommentDto) {
    const newComment = this.commentsService.create(createCommentDto);

    if ('message' in newComment) {
      throw new HttpException(
        newComment?.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (newComment) {
      return newComment;
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Comment],
  })
  findAll(@Query() params: CommentsQueryParams) {
    return this.commentsService.findAll(params.articleId);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param() params: CommentsParams) {
    const comment = this.commentsService.findOne(params.id);
    if (comment) {
      return comment;
    }
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  remove(@Param() params: CommentsParams) {
    const comment = this.commentsService.remove(params.id);
    if (comment) {
      return comment;
    }
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
