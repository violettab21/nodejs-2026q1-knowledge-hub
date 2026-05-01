import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import 'dotenv/config';
import { firstValueFrom } from 'rxjs';
import { SummarizeArticleAiDto } from './dto/summarizeArticle.dto';
import { ArticlesService } from 'src/articles/articles.service';
import { SummarizeArticleResponse } from './interfaces/summarizeArticle.interface';
import { generateSummarizeArticlesPrompt } from './prompts/prompts';

const baseURL = 'https://generativelanguage.googleapis.com';

const summarySize = {
  short: 50,
  medium: 250,
  detailed: 500,
};

@Injectable()
export class AiService {
  constructor(
    private readonly httpService: HttpService,
    private articlesService: ArticlesService,
  ) {}
  async test(): Promise<unknown> {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${baseURL}/v1/models?key=${process.env.GEMINI_API_KEY}`,
      ),
    );
    console.log(data);
    return data;
  }

  async summarize(
    summarizeArticleAiDto: SummarizeArticleAiDto,
    articleId: string,
  ): Promise<unknown> {
    const article = await this.articlesService.findOne(articleId);
    if (!article) return null;

    const { title, content } = article;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `${generateSummarizeArticlesPrompt(summarizeArticleAiDto.maxLength ? summarySize[summarizeArticleAiDto.maxLength] : 250, title, content)}`,
            },
          ],
        },
      ],
    };
    try {
      const result = await firstValueFrom(
        this.httpService.post(
          `${baseURL}/v1/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': `${process.env.GEMINI_API_KEY}`,
            },
          },
        ),
      );
      const summary = result.data.candidates[0].content.parts[0].text;
      const response: SummarizeArticleResponse = {
        articleId: articleId,
        summary: summary,
        originalLength: content.length,
        summaryLength: summary.length,
      };
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
