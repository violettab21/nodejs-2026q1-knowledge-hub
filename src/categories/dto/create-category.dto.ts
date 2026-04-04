import { IsDefined } from 'class-validator';

export class CreateCategoryDto {
  @IsDefined()
  name: string;
  @IsDefined()
  description: string;
}
