import { IsDefined } from 'class-validator';

export class GenerateDto {
  @IsDefined()
  prompt: string;
}
