import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { HttpModule } from '@nestjs/axios';
import { ArticlesModule } from 'src/articles/articles.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import 'dotenv/config';
import { APP_GUARD } from '@nestjs/core';
import { CacheService } from './cache';

const limit = Number(process.env.AI_RATE_LIMIT_RPM) || 20;

@Module({
  imports: [
    HttpModule,
    ArticlesModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: limit }],
    }),
  ],
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CacheService,
  ],
})
export class AiModule {}
