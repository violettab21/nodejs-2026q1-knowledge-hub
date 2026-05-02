import { IsIn, IsOptional } from 'class-validator';
import { Endpoint } from '../usage';

export class UsageParams {
  @IsOptional()
  @IsIn(['summarize', 'translate', 'analyze', 'generate'])
  endpoint: Endpoint;
}
