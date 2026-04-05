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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleParams } from './dto/article-params.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Article } from './entities/article.entity';
import { ArticleStatus } from './enums/article.enum';

@ApiTags('Article')
@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({
    status: 201,
    type: Article,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 422, description: 'Unprocessed entity.' })
  create(@Body() createArticleDto: CreateArticleDto) {
    const newArticle = this.articlesService.create(createArticleDto);

    if ('message' in newArticle) {
      throw new HttpException(
        newArticle.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (newArticle) {
      return newArticle;
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Article],
  })
  findAll(
    @Query('status') status?: ArticleStatus,
    @Query('categoryId') categoryId?: string,
    @Query('tag') tag?: string,
  ) {
    return this.articlesService.findAll(status, categoryId, tag);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Article,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  findOne(@Param() params: ArticleParams) {
    const article = this.articlesService.findOne(params.id);
    if (article) {
      return article;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({
    status: 201,
    type: Article,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  update(
    @Param() params: ArticleParams,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = this.articlesService.update(
      params.id,
      updateArticleDto,
    );
    if (updatedArticle) {
      if ('message' in updatedArticle) {
        throw new HttpException(
          updatedArticle.message,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      return updatedArticle;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  remove(@Param() params: ArticleParams) {
    const deletedArticle = this.articlesService.remove(params.id);
    if (!deletedArticle) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return deletedArticle;
  }
}
