export type GatewayStatus = 'healthy' | 'degraded' | 'down';

export type Gateway = {
  id: string;
  name: string;
  endpoint: string;
  status: GatewayStatus;
  requests24h: number;
  cacheHitRate: number;
  spend: number;
  budget: number;
  activeKeys: number;
  failoverEvents: number;
  topModel: string;
  topProvider: string;
  lastRequest: string;
  p95Latency: string;
  created: string;
};

export const mockGateways: Record<string, Gateway> = {
  'gw-production': {
    id: 'gw-production',
    name: 'production',
    endpoint: 'https://ai-gw-production.b-cdn.net/v1',
    status: 'healthy',
    requests24h: 189000,
    cacheHitRate: 34.2,
    spend: 2847,
    budget: 5000,
    activeKeys: 4,
    failoverEvents: 12,
    topModel: 'claude-sonnet-4.6',
    topProvider: 'Anthropic',
    lastRequest: '2 seconds ago',
    p95Latency: '6.2ms',
    created: 'Jan 15, 2026',
  },
  'gw-staging': {
    id: 'gw-staging',
    name: 'staging',
    endpoint: 'https://ai-gw-staging.b-cdn.net/v1',
    status: 'healthy',
    requests24h: 24500,
    cacheHitRate: 28.1,
    spend: 312,
    budget: 1000,
    activeKeys: 2,
    failoverEvents: 3,
    topModel: 'gpt-4o-mini',
    topProvider: 'OpenAI',
    lastRequest: '3 hours ago',
    p95Latency: '5.8ms',
    created: 'Feb 10, 2026',
  },
  'gw-new': {
    id: 'gw-new',
    name: 'my-new-gateway',
    endpoint: 'https://ai-gw-new.b-cdn.net/v1',
    status: 'healthy',
    requests24h: 0,
    cacheHitRate: 0,
    spend: 0,
    budget: 1000,
    activeKeys: 0,
    failoverEvents: 0,
    topModel: '',
    topProvider: '',
    lastRequest: 'Never',
    p95Latency: '—',
    created: 'Mar 30, 2026',
  },
  'gw-eu-only': {
    id: 'gw-eu-only',
    name: 'eu-only',
    endpoint: 'https://ai-gw-eu.b-cdn.net/v1',
    status: 'healthy',
    requests24h: 67200,
    cacheHitRate: 41.5,
    spend: 890,
    budget: 2000,
    activeKeys: 2,
    failoverEvents: 1,
    topModel: 'claude-haiku-4.5',
    topProvider: 'Anthropic',
    lastRequest: '15 seconds ago',
    p95Latency: '7.1ms',
    created: 'Mar 1, 2026',
  },
};

export const mockGatewaysArray = Object.values(mockGateways);
