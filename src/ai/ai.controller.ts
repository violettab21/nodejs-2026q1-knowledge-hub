import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
import {
  AnalyzeArticleAiDto,
  AnalyzeArticleParams,
} from './dto/analyzeArticle.dto';
import { GenerateDto } from './dto/generate.dto';
import { UsageParams } from './dto/usage.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

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

  @Post('articles/:articleId/analyze')
  @HttpCode(200)
  async analyzeArticles(
    @Body() analyzeArticleAiDto: AnalyzeArticleAiDto,
    @Param() params: AnalyzeArticleParams,
  ) {
    const { articleId } = params;
    try {
      const analyze = await this.aiService.analyze(
        analyzeArticleAiDto,
        articleId,
      );
      if (!analyze) {
        throw new NotFoundError('Article not found');
      }
      return analyze;
    } catch (err) {
      throw err;
    }
  }

  @Post('generate')
  @HttpCode(200)
  async generate(@Body() prompt: GenerateDto) {
    try {
      const result = await this.aiService.generate(prompt);

      return result;
    } catch (err) {
      throw err;
    }
  }

  @Get('usage')
  @HttpCode(200)
  usage(@Query() params?: UsageParams) {
    try {
      const result = this.aiService.usage(params.endpoint);

      return result;
    } catch (err) {
      throw err;
    }
  }
}
