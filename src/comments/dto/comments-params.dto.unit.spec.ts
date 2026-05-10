import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CommentsQueryParams } from './comments-params.dto';

describe('Comment query parameters DTO', () => {
  it('should not fail if all parameters passed and valid', async () => {
    const validQueryParams = {
      articleId: '58118e98-5879-4536-841a-daa3ba3b67bc',
      page: '5',
      limit: '10',
      sortBy: 'content',
      order: 'asc',
    };
    const dto = plainToInstance(CommentsQueryParams, validQueryParams);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should not fail if all required parameters passed and valid', async () => {
    const validQueryParams = {
      articleId: '58118e98-5879-4536-841a-daa3ba3b67bc',
    };
    const dto = plainToInstance(CommentsQueryParams, validQueryParams);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if required field is missing', async () => {
    const invalidQueryParams = {
      page: '5',
      limit: '10',
      sortBy: 'content',
      order: 'asc',
    };
    const dto = plainToInstance(CommentsQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if articleId is invalid', async () => {
    const invalidQueryParams = {
      articleId: '58118e98-587',
    };
    const dto = plainToInstance(CommentsQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if page invalid', async () => {
    const invalidQueryParams = {
      page: 'hello',
    };
    const dto = plainToInstance(CommentsQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if limit invalid', async () => {
    const invalidQueryParams = {
      limit: -1,
    };
    const dto = plainToInstance(CommentsQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if sortBy invalid', async () => {
    const invalidQueryParams = {
      sortBy: 'orderby',
    };
    const dto = plainToInstance(CommentsQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if order invalid', async () => {
    const invalidQueryParams = {
      order: 'some order',
    };
    const dto = plainToInstance(CommentsQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
