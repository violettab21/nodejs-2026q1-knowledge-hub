import { plainToInstance } from 'class-transformer';
import { CreateArticleDto } from './create-article.dto';
import { validateOrReject } from 'class-validator';

describe('Create Article DTO', () => {
  it('should not fail if all fields passed and valid', async () => {
    const validArticle = {
      title: 'Article NEW ARTICLE',
      content: 'Article3 content',
      authorId: '915b21e3-fa85-413a-9a6a-c01030592935',
      categoryId: '58118e98-5879-4536-841a-daa3ba3b67bc',
      tags: ['tag1', 'tag2'],
    };
    const dto = plainToInstance(CreateArticleDto, validArticle);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should not fail if all required fields passed and valid', async () => {
    const validArticle = {
      title: 'Article NEW ARTICLE',
      content: 'Article3 content',
    };
    const dto = plainToInstance(CreateArticleDto, validArticle);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if required fields are missing', async () => {
    const invalidArticle = {
      content: 'Article3 content',
      authorId: '915b21e3-fa85-413a-9a6a-c01030592935',
      categoryId: '58118e98-5879-4536-841a-daa3ba3b67bc',
      tags: ['tag1', 'tag2'],
    };
    const dto = plainToInstance(CreateArticleDto, invalidArticle);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if status is invalid', async () => {
    const invalidArticle = {
      title: 'Article NEW ARTICLE',
      content: 'Article3 content',
      status: 'UNKNOWN',
      authorId: '915b21e3-fa85-413a-9a6a-c01030592935',
      categoryId: '58118e98-5879-4536-841a-daa3ba3b67bc',
      tags: ['tag1', 'tag2'],
    };
    const dto = plainToInstance(CreateArticleDto, invalidArticle);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
