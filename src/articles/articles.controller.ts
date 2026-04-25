import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleParams, ArticleQueryParams } from './dto/article-params.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Article } from './entities/article.entity';
import {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNPROCESSED_MESSAGE,
} from '../constants/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Roles } from '../auth/auth.roles';
import { PermissionsArticlesGuard } from '../auth/guards/articlePermissions.guard';
import { UserRole } from '../../generated/prisma/enums';

@ApiTags('Article')
@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiBody({ type: CreateArticleDto })
  @Roles([UserRole.ADMIN, UserRole.EDITOR])
  @UseGuards(PermissionsArticlesGuard)
  @ApiResponse({
    status: 201,
    type: Article,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 422, description: UNPROCESSED_MESSAGE })
  async create(@Body() createArticleDto: CreateArticleDto) {
    try {
      const newArticle = await this.articlesService.create(createArticleDto);
      return newArticle;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException(BAD_REQUEST_MESSAGE, HttpStatus.BAD_REQUEST);
        }
        if (err.code === 'P2003') {
          throw new HttpException(
            'Non existing category or author',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Article],
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async findAll(@Query() params?: ArticleQueryParams) {
    const { status, categoryId, tag, page, limit, sortBy, order } = params;
    return await this.articlesService.findAll(
      status,
      categoryId,
      tag,
      page,
      limit,
      sortBy,
      order,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Article,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async findOne(@Param() params: ArticleParams) {
    const article = await this.articlesService.findOne(params.id);
    if (article) {
      return article;
    }
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @Roles([UserRole.ADMIN, UserRole.EDITOR])
  @UseGuards(PermissionsArticlesGuard)
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({
    status: 200,
    type: Article,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 422, description: UNPROCESSED_MESSAGE })
  async update(
    @Param() params: ArticleParams,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    try {
      const updatedArticle = await this.articlesService.update(
        params.id,
        updateArticleDto,
      );
      return updatedArticle;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException(BAD_REQUEST_MESSAGE, HttpStatus.BAD_REQUEST);
        }
        if (err.code === 'P2003') {
          throw new HttpException(
            'Non existing category or author',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        if (err.code === 'P2025') {
          throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
        }
      }
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles([UserRole.ADMIN, UserRole.EDITOR])
  @UseGuards(PermissionsArticlesGuard)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async remove(@Param() params: ArticleParams) {
    try {
      const deletedArticle = await this.articlesService.remove(params.id);
      return deletedArticle;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
        }
      }
    }
  }
}
