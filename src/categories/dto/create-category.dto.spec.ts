import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

describe('Create Article DTO', () => {
  it('should not fail if all fields passed and valid', async () => {
    const validCategory = {
      name: 'name',
      description: 'description',
    };
    const dto = plainToInstance(CreateCategoryDto, validCategory);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if required fields are missing', async () => {
    const invalidCategory = {
      name: 'name',
    };
    const dto = plainToInstance(CreateCategoryDto, invalidCategory);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
