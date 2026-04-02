import { IsUUID } from 'class-validator';

export class UserParams {
  @IsUUID()
  id: string;
}
