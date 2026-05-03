import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export type Endpoint = 'summarize' | 'translate' | 'analyze' | 'generate';

export interface RequestUsage {
  id: string;
  endpoint: Endpoint;
  tokens: number | null;
}

/*const testRequests: RequestUsage[] = [
  { id: '1', endpoint: 'summarize', tokens: 1 },
  { id: '2', endpoint: 'analyze', tokens: 3 },
  { id: '3', endpoint: 'translate', tokens: 4 },
  { id: '3', endpoint: 'translate', tokens: null },
  { id: '4', endpoint: 'analyze', tokens: 12 },
  { id: '5', endpoint: 'summarize', tokens: null },
  { id: '6', endpoint: 'translate', tokens: 78 },
  { id: '7', endpoint: 'summarize', tokens: null },
];*/

@Injectable()
export class UsageStorage {
  requests: Set<RequestUsage> = new Set();

  getAIRequests() {
    return Array.from(this.requests.values());
  }

  getTotalAIRequestsByEndpoint(endpoint: Endpoint) {
    const req = this.getAIRequests();
    const requestsByEndpoint = req.filter((req) => req.endpoint === endpoint);
    return requestsByEndpoint;
  }

  addRequest(endpoint: Endpoint, tokens?: number) {
    this.requests.add({ id: randomUUID(), endpoint, tokens: tokens || null });
  }
}
