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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleParams } from './dto/article-params.dto';

@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll(
    @Query('status') status?: 'draft' | 'published' | 'archived',
    @Query('categoryId') categoryId?: string,
    @Query('tag') tag?: string,
  ) {
    return this.articlesService.findAll(status, categoryId, tag);
  }

  @Get(':id')
  findOne(@Param() params: ArticleParams) {
    const article = this.articlesService.findOne(params.id);
    if (article) {
      return article;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  update(
    @Param() params: ArticleParams,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = this.articlesService.update(
      params.id,
      updateArticleDto,
    );
    if (updatedArticle) {
      return updatedArticle;
    }
  }

  @Delete(':id')
  remove(@Param() params: ArticleParams) {
    const deletedArticle = this.articlesService.remove(params.id);
    if (!deletedArticle) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return deletedArticle;
  }
}
