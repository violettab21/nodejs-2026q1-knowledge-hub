import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('Update User DTO', () => {
  it('should not fail if all fields passed and valid', async () => {
    const validUser = {
      oldPassword: 'password1',
      newPassword: 'password2',
    };
    const dto = plainToInstance(UpdateUserDto, validUser);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if required fields are missing', async () => {
    const invalidUser = {
      oldPassword: 'password',
    };
    const dto = plainToInstance(UpdateUserDto, invalidUser);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
