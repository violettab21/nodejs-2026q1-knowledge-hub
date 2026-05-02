import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import 'dotenv/config';
import { firstValueFrom } from 'rxjs';
import { SummarizeArticleAiDto } from './dto/summarizeArticle.dto';
import { ArticlesService } from 'src/articles/articles.service';
import { SummarizeArticleResponse } from './interfaces/summarizeArticle.interface';
import {
  generateAnalyzeArticlePrompt,
  generateSummarizeArticlesPrompt,
  generateTranslateArticlePrompt,
} from './prompts/prompts';
import { TranslateArticleAiDto } from './dto/translateArticle.dto';
import { TranslateArticleResponse } from './interfaces/translateArticle.interface';
import { AnalyzeArticleAiDto } from './dto/analyzeArticle.dto';
import { GenerateDto } from './dto/generate.dto';
import { GenerateResponse } from './interfaces/generate.interface';
import { AnalyzeArticleResponse } from './interfaces/analyzeArticle.interface';
import { CacheService } from './cache';
import { UsageStorage } from './usage';
import type { Endpoint, RequestUsage } from './usage';
import { EndpointUsage } from './interfaces/usage.interface';

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
    private cacheService: CacheService,
    private usageStorage: UsageStorage,
  ) {}

  async summarize(
    summarizeArticleAiDto: SummarizeArticleAiDto,
    articleId: string,
  ): Promise<SummarizeArticleResponse> {
    const article = await this.articlesService.findOne(articleId);
    if (!article) return null;

    const { title, content, updatedAt } = article;
    const cacheKey = `${articleId}-${JSON.stringify(summarizeArticleAiDto)}-${updatedAt}`;

    const cachedRes = this.cacheService.getCachedResponseByKey(cacheKey);
    if (cachedRes) {
      console.log(`Getting from cache, key ${cacheKey}`);
      return cachedRes as SummarizeArticleResponse;
    }

    const prompt = `${generateSummarizeArticlesPrompt(summarizeArticleAiDto.maxLength ? summarySize[summarizeArticleAiDto.maxLength] : 250, title, content)}`;

    try {
      const { result, tokens } = await this.getAIResponse({ prompt });
      this.usageStorage.addRequest('summarize', tokens);

      const response: SummarizeArticleResponse = {
        articleId: articleId,
        summary: result,
        originalLength: content.length,
        summaryLength: result.length,
      };
      console.log(`setting  cache, key ${cacheKey}`);
      this.cacheService.setCachedResponse(cacheKey, response);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async translate(
    translateArticleAiDto: TranslateArticleAiDto,
    articleId: string,
  ): Promise<TranslateArticleResponse> {
    const article = await this.articlesService.findOne(articleId);
    if (!article) return null;

    const { title, content, updatedAt } = article;
    const prompt = `${generateTranslateArticlePrompt(translateArticleAiDto.targetLanguage, translateArticleAiDto.sourceLanguage, title, content)}`;
    const cacheKey = `${articleId}-${JSON.stringify(translateArticleAiDto)}-${updatedAt}`;

    const cachedRes = this.cacheService.getCachedResponseByKey(cacheKey);
    if (cachedRes) {
      console.log(`Getting from cache, key ${cacheKey}`);
      return cachedRes as TranslateArticleResponse;
    }
    try {
      const { result, tokens } = await this.getAIResponse({ prompt });
      this.usageStorage.addRequest('translate', tokens);
      const parts = result.split('\n');
      const detectedData = parts[0];
      const detectedLang = detectedData.split(':')[1];
      const translated = parts.slice(1).join();

      const response: TranslateArticleResponse = {
        articleId: articleId,
        translatedText: translated,
        detectedLanguage: detectedLang,
      };
      console.log(`Setting cache with key ${cacheKey}`);
      this.cacheService.setCachedResponse(cacheKey, response);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async analyze(
    analyzeArticleAiDto: AnalyzeArticleAiDto,
    articleId: string,
  ): Promise<AnalyzeArticleResponse> {
    const article = await this.articlesService.findOne(articleId);
    if (!article) return null;

    const { title, content } = article;
    const prompt = `${generateAnalyzeArticlePrompt(title, content, analyzeArticleAiDto.task)}`;
    try {
      const { result, tokens } = await this.getAIResponse({ prompt });
      this.usageStorage.addRequest('analyze', tokens);
      const jsonStart = result.indexOf('{');
      const jsonEnd = result.lastIndexOf('}');
      const json = result.slice(jsonStart, jsonEnd + 1).trim();
      const obj = JSON.parse(json.trim());
      const response: AnalyzeArticleResponse = {
        articleId: articleId,
        analysis: obj.ANALYSIS_RES,
        suggestions: obj.SUGGESTIONS_RES,
        severity: obj.SEVERITY_RES,
      };

      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async generate(prompt: GenerateDto) {
    try {
      const { result, tokens } = await this.getAIResponse(prompt);
      this.usageStorage.addRequest('generate', tokens);
      return { result: result };
    } catch (err) {
      throw err;
    }
  }

  async getAIResponse(prompt: GenerateDto) {
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt.prompt,
            },
          ],
        },
      ],
    };
    try {
      const result = await firstValueFrom(
        this.httpService.post(
          `${baseURL}/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': `${process.env.GEMINI_API_KEY}`,
            },
          },
        ),
      );
      console.log(result.data);
      const answer = result.data.candidates[0].content.parts[0].text;

      const response: GenerateResponse = {
        result: answer,
        tokens: result.data?.usageMetadata?.totalTokenCount || null,
      };

      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  usage(endpoint?: Endpoint) {
    const totalRequests = this.usageStorage.getAIRequests().length;
    let requests: RequestUsage[] = [];
    requests = endpoint
      ? this.usageStorage.getTotalAIRequestsByEndpoint(endpoint)
      : this.usageStorage.getAIRequests();
    const map: Map<Endpoint, EndpointUsage> = new Map();

    requests.forEach((request) => {
      if (map.has(request.endpoint)) {
        const currentCalculatedEndpointData = map.get(request.endpoint);
        map.set(request.endpoint, {
          ...currentCalculatedEndpointData,
          total: currentCalculatedEndpointData.total + 1,
          tokens: request.tokens
            ? currentCalculatedEndpointData.tokens + request.tokens
            : currentCalculatedEndpointData.tokens,
        });
      } else {
        map.set(request.endpoint, {
          endpoint: request.endpoint,
          total: 1,
          tokens: request.tokens || null,
        });
      }
    });
    const result = {
      total: totalRequests,
      result: Array.from(map.values()),
    };
    return result;
  }
}
