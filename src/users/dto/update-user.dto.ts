import { IsDefined } from 'class-validator';

export class UpdateUserDto {
  @IsDefined()
  oldPassword: string;
  @IsDefined()
  newPassword: string;
}
