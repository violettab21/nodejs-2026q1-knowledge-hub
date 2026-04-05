import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { dump } from 'js-yaml';
import { writeFile } from 'node:fs/promises';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
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
  await app.listen(4000);
}
bootstrap();
