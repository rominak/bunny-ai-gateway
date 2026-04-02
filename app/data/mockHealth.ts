import { ResourceHealth, AccountHealth, HealthStatus, BunnyProduct } from '../types/userProfile';

// ===========================================
// Mock Pull Zone Health Data
// ===========================================

export const MOCK_PULL_ZONES: ResourceHealth[] = [
  {
    id: 'pz-1',
    name: 'production-cdn',
    type: 'pull-zone',
    status: 'healthy',
    lastActivity: '2 min ago',
    errorCount24h: 0,
    warningCount24h: 2,
    metrics: {
      traffic24h: '1.2 GB',
      requests24h: 45230,
      cacheHitRate: 94.5,
      avgLatency: 23,
    },
  },
  {
    id: 'pz-2',
    name: 'staging-cdn',
    type: 'pull-zone',
    status: 'warning',
    lastActivity: '5 min ago',
    errorCount24h: 12,
    warningCount24h: 45,
    metrics: {
      traffic24h: '45 MB',
      requests24h: 1250,
      cacheHitRate: 78.2,
      avgLatency: 89,
    },
    issues: ['High latency detected', 'Cache hit rate below 80%'],
  },
  {
    id: 'pz-3',
    name: 'legacy-api',
    type: 'pull-zone',
    status: 'error',
    lastActivity: '1 hour ago',
    errorCount24h: 847,
    warningCount24h: 123,
    metrics: {
      traffic24h: '0 B',
      requests24h: 0,
      cacheHitRate: 0,
      avgLatency: 0,
    },
    issues: ['Origin server returning 502 errors', 'No traffic in last hour'],
  },
  {
    id: 'pz-4',
    name: 'assets-cdn',
    type: 'pull-zone',
    status: 'healthy',
    lastActivity: '30 sec ago',
    errorCount24h: 0,
    warningCount24h: 0,
    metrics: {
      traffic24h: '856 MB',
      requests24h: 28450,
      cacheHitRate: 98.1,
      avgLatency: 18,
    },
  },
  {
    id: 'pz-5',
    name: 'media-delivery',
    type: 'pull-zone',
    status: 'healthy',
    lastActivity: '1 min ago',
    errorCount24h: 3,
    warningCount24h: 8,
    metrics: {
      traffic24h: '3.4 GB',
      requests24h: 12890,
      cacheHitRate: 91.3,
      avgLatency: 45,
    },
  },
];

// ===========================================
// Mock Storage Zone Health Data
// ===========================================

export const MOCK_STORAGE_ZONES: ResourceHealth[] = [
  {
    id: 'sz-1',
    name: 'media-storage',
    type: 'storage-zone',
    status: 'healthy',
    lastActivity: '10 min ago',
    errorCount24h: 0,
    warningCount24h: 0,
    metrics: {
      traffic24h: '2.1 GB',
      requests24h: 3420,
    },
  },
  {
    id: 'sz-2',
    name: 'backup-zone',
    type: 'storage-zone',
    status: 'warning',
    lastActivity: '3 hours ago',
    errorCount24h: 0,
    warningCount24h: 5,
    metrics: {
      traffic24h: '125 MB',
      requests24h: 45,
    },
    issues: ['Replication lag detected (2 regions behind)'],
  },
  {
    id: 'sz-3',
    name: 'user-uploads',
    type: 'storage-zone',
    status: 'healthy',
    lastActivity: '2 min ago',
    errorCount24h: 1,
    warningCount24h: 3,
    metrics: {
      traffic24h: '567 MB',
      requests24h: 892,
    },
  },
];

// ===========================================
// Mock Video Library Health Data
// ===========================================

export const MOCK_VIDEO_LIBRARIES: ResourceHealth[] = [
  {
    id: 'vl-1',
    name: 'Marketing Videos',
    type: 'video-library',
    status: 'healthy',
    lastActivity: '15 min ago',
    errorCount24h: 0,
    warningCount24h: 1,
    metrics: {
      traffic24h: '4.5 GB',
      requests24h: 2340,
    },
  },
  {
    id: 'vl-2',
    name: 'Course Content',
    type: 'video-library',
    status: 'warning',
    lastActivity: '1 hour ago',
    errorCount24h: 2,
    warningCount24h: 8,
    metrics: {
      traffic24h: '1.2 GB',
      requests24h: 567,
    },
    issues: ['3 videos failed encoding', 'Transcription queue backlog'],
  },
  {
    id: 'vl-3',
    name: 'Product Demos',
    type: 'video-library',
    status: 'healthy',
    lastActivity: '5 min ago',
    errorCount24h: 0,
    warningCount24h: 0,
    metrics: {
      traffic24h: '890 MB',
      requests24h: 1230,
    },
  },
];

// ===========================================
// Mock DNS Zone Health Data
// ===========================================

export const MOCK_DNS_ZONES: ResourceHealth[] = [
  {
    id: 'dns-1',
    name: 'example.com',
    type: 'dns-zone',
    status: 'healthy',
    lastActivity: '1 min ago',
    errorCount24h: 0,
    warningCount24h: 0,
    metrics: {
      requests24h: 125000,
    },
  },
  {
    id: 'dns-2',
    name: 'api.example.com',
    type: 'dns-zone',
    status: 'warning',
    lastActivity: '30 min ago',
    errorCount24h: 0,
    warningCount24h: 1,
    issues: ['DNSSEC not configured'],
  },
];

// ===========================================
// Aggregate Account Health
// ===========================================

export function calculateAccountHealth(resources: ResourceHealth[]): AccountHealth {
  const summary = {
    healthy: resources.filter(r => r.status === 'healthy').length,
    warning: resources.filter(r => r.status === 'warning').length,
    error: resources.filter(r => r.status === 'error').length,
    total: resources.length,
  };

  // Determine overall status
  let overall: HealthStatus = 'healthy';
  if (summary.error > 0) {
    overall = 'error';
  } else if (summary.warning > 0) {
    overall = 'warning';
  }

  // Group by product (simplified mapping)
  const productMap: Record<string, BunnyProduct> = {
    'pull-zone': 'cdn',
    'storage-zone': 'storage',
    'video-library': 'stream',
    'dns-zone': 'dns',
    'script': 'edge-scripting',
    'container': 'magic-containers',
  };

  const byProduct = {} as AccountHealth['byProduct'];
  const products: BunnyProduct[] = ['cdn', 'stream', 'storage', 'dns', 'optimizer', 'shield', 'edge-scripting', 'magic-containers'];

  products.forEach(product => {
    const productResources = resources.filter(r => productMap[r.type] === product);
    const errorCount = productResources.filter(r => r.status === 'error').length;
    const warningCount = productResources.filter(r => r.status === 'warning').length;

    let status: HealthStatus = 'healthy';
    if (errorCount > 0) status = 'error';
    else if (warningCount > 0) status = 'warning';

    byProduct[product] = {
      status,
      resourceCount: productResources.length,
      errorCount: productResources.reduce((sum, r) => sum + r.errorCount24h, 0),
    };
  });

  return {
    overall,
    summary,
    byProduct,
    lastUpdated: new Date().toISOString(),
  };
}

// ===========================================
// Combined Mock Data Export
// ===========================================

export const ALL_MOCK_RESOURCES: ResourceHealth[] = [
  ...MOCK_PULL_ZONES,
  ...MOCK_STORAGE_ZONES,
  ...MOCK_VIDEO_LIBRARIES,
  ...MOCK_DNS_ZONES,
];

export const MOCK_ACCOUNT_HEALTH = calculateAccountHealth(ALL_MOCK_RESOURCES);

// ===========================================
// Attention Required Items
// ===========================================

export interface AttentionItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'health' | 'security' | 'billing' | 'certificate' | 'quota';
  title: string;
  description: string;
  resourceId?: string;
  resourceType?: ResourceHealth['type'];
  actionLabel?: string;
  actionUrl?: string;
  timestamp: string;
}

export const MOCK_ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: 'att-1',
    type: 'error',
    category: 'health',
    title: 'Origin server errors',
    description: 'legacy-api pull zone is returning 502 errors from origin',
    resourceId: 'pz-3',
    resourceType: 'pull-zone',
    actionLabel: 'View errors',
    actionUrl: '/cdn/pz-3/errors',
    timestamp: '5 min ago',
  },
  {
    id: 'att-2',
    type: 'warning',
    category: 'certificate',
    title: 'SSL certificate expiring',
    description: 'Certificate for staging-cdn.example.com expires in 7 days',
    resourceId: 'pz-2',
    resourceType: 'pull-zone',
    actionLabel: 'Renew certificate',
    actionUrl: '/cdn/pz-2/ssl',
    timestamp: '2 hours ago',
  },
  {
    id: 'att-3',
    type: 'warning',
    category: 'health',
    title: 'Encoding failures',
    description: '3 videos in Course Content library failed to encode',
    resourceId: 'vl-2',
    resourceType: 'video-library',
    actionLabel: 'View failed videos',
    actionUrl: '/stream/vl-2/encoding',
    timestamp: '1 hour ago',
  },
  {
    id: 'att-4',
    type: 'info',
    category: 'security',
    title: '2FA not enabled',
    description: 'Enable two-factor authentication for better account security',
    actionLabel: 'Enable 2FA',
    actionUrl: '/account/security',
    timestamp: '1 day ago',
  },
  {
    id: 'att-5',
    type: 'warning',
    category: 'billing',
    title: 'Low balance warning',
    description: 'Account balance will run out in approximately 5 days at current usage rate',
    actionLabel: 'Add funds',
    actionUrl: '/account/billing',
    timestamp: '3 hours ago',
  },
];
