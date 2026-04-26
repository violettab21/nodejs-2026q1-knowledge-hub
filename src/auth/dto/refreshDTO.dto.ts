import { IsDefined, IsString } from 'class-validator';

export class RefreshDTO {
  @IsDefined()
  @IsString()
  refreshToken: string;
}
