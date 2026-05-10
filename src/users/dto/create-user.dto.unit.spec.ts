import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('Create User DTO', () => {
  it('should not fail if all fields passed and valid', async () => {
    const validUser = {
      login: 'login',
      password: 'password',
      role: 'VIEWER',
    };
    const dto = plainToInstance(CreateUserDto, validUser);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should not fail if required fields passed and valid', async () => {
    const validUser = {
      login: 'login',
      password: 'password',
    };
    const dto = plainToInstance(CreateUserDto, validUser);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if required fields are missing', async () => {
    const invalidUser = {
      password: 'password',
    };
    const dto = plainToInstance(CreateUserDto, invalidUser);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if status is invalid', async () => {
    const invalidUser = {
      login: 'login',
      password: 'password',
      role: 'UNKNOWN',
    };
    const dto = plainToInstance(CreateUserDto, invalidUser);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
