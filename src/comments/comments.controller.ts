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
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsParams, CommentsQueryParams } from './dto/comments-params.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';
import {
  BAD_REQUEST_MESSAGE,
  INTERNAL_ERROR_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNPROCESSED_MESSAGE,
} from 'src/constants/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UserRole } from 'generated/prisma/enums';
import { Roles } from 'src/auth/auth.roles';
import { PermissionsCommentsGuard } from 'src/auth/guards/commentsPermissions.guard';

@ApiTags('Comment')
@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Roles([UserRole.ADMIN, UserRole.EDITOR])
  @UseGuards(PermissionsCommentsGuard)
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    type: Comment,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 422, description: UNPROCESSED_MESSAGE })
  async create(@Body() createCommentDto: CreateCommentDto) {
    try {
      const newComment = await this.commentsService.create(createCommentDto);
      return newComment;
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(
          `Non existing ${err.message}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Comment],
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async findAll(@Query() params: CommentsQueryParams) {
    const { articleId, page, limit, sortBy, order } = params;
    return await this.commentsService.findAll(
      articleId,
      page,
      limit,
      sortBy,
      order,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Comment,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  async findOne(@Param() params: CommentsParams) {
    const comment = await this.commentsService.findOne(params.id);
    if (comment) {
      return comment;
    }
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }

  @Delete(':id')
  @UseGuards(PermissionsCommentsGuard)
  @Roles([UserRole.ADMIN, UserRole.EDITOR])
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async remove(@Param() params: CommentsParams) {
    try {
      const comment = await this.commentsService.remove(params.id);
      if (comment) {
        return comment;
      }
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          INTERNAL_ERROR_MESSAGE,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
