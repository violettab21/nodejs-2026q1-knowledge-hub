import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CategoryQueryParams } from './category-params.dto';

describe('Article query parameters DTO', () => {
  it('should not fail if all parameters passed and valid', async () => {
    const validQueryParams = {
      page: '5',
      limit: '10',
      sortBy: 'name',
      order: 'asc',
    };
    const dto = plainToInstance(CategoryQueryParams, validQueryParams);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should not fail if no query params passed', async () => {
    const dto = plainToInstance(CategoryQueryParams, {});
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if page invalid', async () => {
    const invalidQueryParams = {
      page: 0,
    };
    const dto = plainToInstance(CategoryQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if limit invalid', async () => {
    const invalidQueryParams = {
      limit: 0,
    };
    const dto = plainToInstance(CategoryQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if sortBy invalid', async () => {
    const invalidQueryParams = {
      sortBy: 'hello',
    };
    const dto = plainToInstance(CategoryQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if order invalid', async () => {
    const invalidQueryParams = {
      order: 'hello',
    };
    const dto = plainToInstance(CategoryQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
