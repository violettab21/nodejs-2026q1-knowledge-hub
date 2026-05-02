import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import {
  SummarizeArticleAiDto,
  SummarizeArticleParams,
} from './dto/summarizeArticle.dto';
import { NotFoundError } from 'src/errors/NotFoundError';
import {
  TranslateArticleAiDto,
  TranslateArticleParams,
} from './dto/translateArticle.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get()
  async test() {
    return await this.aiService.test();
  }

  @Post('articles/:articleId/summarize')
  @HttpCode(200)
  async summarizeArticles(
    @Body() summarizeArticleAiDto: SummarizeArticleAiDto,
    @Param() params: SummarizeArticleParams,
  ) {
    const { articleId } = params;
    try {
      const summary = await this.aiService.summarize(
        summarizeArticleAiDto,
        articleId,
      );
      if (!summary) {
        throw new NotFoundError('Article not found');
      }
      return summary;
    } catch (err) {
      throw err;
    }
  }

  @Post('articles/:articleId/translate')
  @HttpCode(200)
  async translateArticles(
    @Body() translateArticleAiDto: TranslateArticleAiDto,
    @Param() params: TranslateArticleParams,
  ) {
    const { articleId } = params;
    try {
      const translate = await this.aiService.translate(
        translateArticleAiDto,
        articleId,
      );
      if (!translate) {
        throw new NotFoundError('Article not found');
      }
      return translate;
    } catch (err) {
      throw err;
    }
  }
}
