import { IsDefined, IsIn, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  login: string;
  @IsDefined()
  password: string;
  @IsDefined()
  @IsIn(['admin', 'editor', 'viewer'])
  @IsOptional()
  role?: 'admin' | 'editor' | 'viewer';
}
