import { IsUUID } from 'class-validator';

export class CategoryParams {
  @IsUUID()
  id: string;
}
