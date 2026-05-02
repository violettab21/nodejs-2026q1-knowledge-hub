import { Endpoint } from '../usage';

export interface EndpointUsage {
  endpoint: Endpoint;
  total: number;
  tokens: number | null;
}

export interface UsageResponse {
  total: number;
  result: EndpointUsage[];
}
