import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { dump } from 'js-yaml';
import { writeFile } from 'node:fs/promises';
import 'dotenv/config';
import { HttpExceptionFilter } from './http-exception.filter';
import { PrismaService } from './prisma/prisma.service';
import { Logger } from '@nestjs/common';

type Level = 'log' | 'debug' | 'warn' | 'error' | 'verbose';

const level = (`${process.env.LOG_LEVEL}` as Level) || 'log';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: [level],
  });

  const db = app.get(PrismaService);
  process.on('uncaughtException', async (error) => {
    Logger.error(error.message, error.stack);
    await app.close();
    await db.closeConnection();
    process.exit(1);
  });

  process.on('unhandledRejection ', async (error) => {
    Logger.error(error.message, error.stack);
    await app.close();
    await db.closeConnection();
    process.exit(1);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Knowledge Hub')
    .setDescription('The Knowledge Hub API description')
    .setVersion('1.0')
    .addTag('Knowledge Hub')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  const yaml = dump(documentFactory());
  await writeFile('./doc/swagger.yaml', yaml);
  SwaggerModule.setup('/doc', app, documentFactory);
  await app.listen(process.env.PORT, '0.0.0.0');
}

bootstrap();
