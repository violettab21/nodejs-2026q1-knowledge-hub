import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RefreshDTO } from './refreshDTO.dto';

describe('Refresh DTO', () => {
  it('should not fail if all fields passed and valid', async () => {
    const validRefresh = {
      refreshToken: 'token',
    };
    const dto = plainToInstance(RefreshDTO, validRefresh);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if required fields are missing', async () => {
    const dto = plainToInstance(RefreshDTO, {});

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
