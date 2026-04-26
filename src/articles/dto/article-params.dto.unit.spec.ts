import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ArticleQueryParams } from './article-params.dto';

describe('Article query parameters DTO', () => {
  it('should not fail if all parameters passed and valid', async () => {
    const validQueryParams = {
      status: 'DRAFT',
      page: '5',
      limit: '10',
      sortBy: 'title',
      order: 'asc',
      categoryId: '58118e98-5879-4536-841a-daa3ba3b67bc',
      tags: 'tag1',
    };
    const dto = plainToInstance(ArticleQueryParams, validQueryParams);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should not fail if no query params passed', async () => {
    const dto = plainToInstance(ArticleQueryParams, {});
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if status invalid', async () => {
    const invalidQueryParams = {
      status: 'UNKNOWN',
    };
    const dto = plainToInstance(ArticleQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if page invalid', async () => {
    const invalidQueryParams = {
      page: 'hello',
    };
    const dto = plainToInstance(ArticleQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if limit invalid', async () => {
    const invalidQueryParams = {
      limit: 'hello',
    };
    const dto = plainToInstance(ArticleQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if limit invalid', async () => {
    const invalidQueryParams = {
      sortBy: 'hello',
    };
    const dto = plainToInstance(ArticleQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if order invalid', async () => {
    const invalidQueryParams = {
      order: 'hello',
    };
    const dto = plainToInstance(ArticleQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if categoryId invalid', async () => {
    const invalidQueryParams = {
      categoryId: 'hello',
    };
    const dto = plainToInstance(ArticleQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
