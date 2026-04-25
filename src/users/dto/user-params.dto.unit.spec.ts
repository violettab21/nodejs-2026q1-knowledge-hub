import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { UsersQueryParams } from './user-params.dto';

describe('User query parameters DTO', () => {
  it('should not fail if all parameters passed and valid', async () => {
    const validQueryParams = {
      page: '5',
      limit: '10',
      sortBy: 'login',
      order: 'asc',
    };
    const dto = plainToInstance(UsersQueryParams, validQueryParams);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should not fail if no parameters passed and valid', async () => {
    const dto = plainToInstance(UsersQueryParams, {});
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if page invalid', async () => {
    const invalidQueryParams = {
      page: -5,
    };
    const dto = plainToInstance(UsersQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if limit invalid', async () => {
    const invalidQueryParams = {
      limit: -1,
    };
    const dto = plainToInstance(UsersQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if sortBy invalid', async () => {
    const invalidQueryParams = {
      sortBy: 'orderby',
    };
    const dto = plainToInstance(UsersQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if order invalid', async () => {
    const invalidQueryParams = {
      order: 'some order',
    };
    const dto = plainToInstance(UsersQueryParams, invalidQueryParams);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
