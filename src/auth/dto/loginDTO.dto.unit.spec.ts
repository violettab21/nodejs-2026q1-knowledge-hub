import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { LoginDTO } from './loginDTO.dto';

describe('Login DTO', () => {
  it('should not fail if all fields passed and valid', async () => {
    const validLogin = {
      login: 'login',
      password: 'password',
    };
    const dto = plainToInstance(LoginDTO, validLogin);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if required fields are missing', async () => {
    const invalidLogin = {
      password: 'password',
    };
    const dto = plainToInstance(LoginDTO, invalidLogin);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
