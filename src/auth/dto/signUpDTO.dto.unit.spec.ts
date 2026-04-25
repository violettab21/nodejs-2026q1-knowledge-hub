import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { SignUpDTO } from './signUpDTO.dto';

describe('Sign Up DTO', () => {
  it('should not fail if all fields passed and valid', async () => {
    const validLogin = {
      login: 'login',
      password: 'password',
    };
    const dto = plainToInstance(SignUpDTO, validLogin);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if required fields are missing', async () => {
    const invalidLogin = {
      password: 'password',
    };
    const dto = plainToInstance(SignUpDTO, invalidLogin);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
