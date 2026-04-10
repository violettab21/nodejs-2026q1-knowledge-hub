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
import {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNPROCESSED_MESSAGE,
} from 'src/constants/constants';

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
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 422, description: UNPROCESSED_MESSAGE })
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
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  findAll(@Query() params: CommentsQueryParams) {
    const { articleId, page, limit, sortBy, order } = params;
    return this.commentsService.findAll(articleId, page, limit, sortBy, order);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Comment,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  findOne(@Param() params: CommentsParams) {
    const comment = this.commentsService.findOne(params.id);
    if (comment) {
      return comment;
    }
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  remove(@Param() params: CommentsParams) {
    const comment = this.commentsService.remove(params.id);
    if (comment) {
      return comment;
    }
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }
}
