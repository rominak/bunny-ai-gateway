// Alert System Types
export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';
export type AlertType = 'security' | 'stream' | 'storage' | 'system';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
  dismissible?: boolean;
}

// ===========================================
// Health System Types (NEW)
// ===========================================

export type HealthStatus = 'healthy' | 'warning' | 'error';

export interface ResourceHealth {
  id: string;
  name: string;
  type: 'pull-zone' | 'storage-zone' | 'video-library' | 'dns-zone' | 'script' | 'container' | 'database' | 'live-stream';
  status: HealthStatus;
  lastActivity: string; // relative time like "2 min ago"
  errorCount24h: number;
  warningCount24h: number;
  metrics?: {
    traffic24h?: string; // "1.2 GB"
    requests24h?: number;
    cacheHitRate?: number; // 0-100
    avgLatency?: number; // ms
  };
  issues?: string[]; // List of current issues
}

export interface AccountHealth {
  overall: HealthStatus;
  summary: {
    healthy: number;
    warning: number;
    error: number;
    total: number;
  };
  byProduct: Record<BunnyProduct, {
    status: HealthStatus;
    resourceCount: number;
    errorCount: number;
  }>;
  lastUpdated: string;
}

// ===========================================
// Notification System Types (NEW)
// ===========================================

export type NotificationCategory = 'account' | 'incidents' | 'product-updates';

export interface Notification {
  id: string;
  category: NotificationCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  resourceId?: string; // Link to related resource
  resourceType?: ResourceHealth['type'];
  dismissible?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  lastChecked: string;
}

// ===========================================
// Favourites System Types (NEW)
// ===========================================

export interface Favourite {
  id: string;
  resourceId: string;
  resourceType: ResourceHealth['type'];
  name: string;
  icon?: string; // FontAwesome icon name
  addedAt: string;
}

// Onboarding System Types
export type OnboardingStepId =
  | 'confirm-email'
  | 'personal-info'
  | 'credit-card'
  | 'start-hopping';

export type OnboardingStepStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';

export interface OnboardingStepConfig {
  id: OnboardingStepId;
  title: string;
  description: string;
  actionLabel: string;
  required: boolean;
}

export interface OnboardingStep {
  step: OnboardingStepId;
  status: OnboardingStepStatus;
  required: boolean;
}

export interface OnboardingState {
  currentStep: OnboardingStepId;
  steps: OnboardingStep[];
  completedAt?: string;
}

// Trial System Types
export interface TrialState {
  isActive: boolean;
  startDate: string;
  endDate: string;
  credits: number;
  usedCredits: number;
  bonusCreditsAvailable: number;
  bonusCreditsClaimed: boolean;
}

// Extended User State (includes onboarding and trial)
export interface UserState {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  onboarding: OnboardingState | null;
  trial: TrialState | null;
  activeProducts: BunnyProduct[];
  productUsage: ProductUsage[];
  preferences: UserPreferences;
  dashboardLayouts: Record<DashboardType, WidgetPosition[]>;
  // NEW: Favourites and notifications
  favourites: Favourite[];
  notifications: NotificationState;
}

// Onboarding step configuration
export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: 'confirm-email',
    title: 'Confirm email',
    description: 'Confirm your email to get started! You can add more details later.',
    actionLabel: 'Re-send confirmation email',
    required: true,
  },
  {
    id: 'personal-info',
    title: 'Enter personal info',
    description: 'Add your name and company details to personalize your experience.',
    actionLabel: 'Continue',
    required: false,
  },
  {
    id: 'credit-card',
    title: 'Add credit card info',
    description: 'Add a payment method to continue using Bunny.net after your trial ends.',
    actionLabel: 'Add payment method',
    required: false,
  },
  {
    id: 'start-hopping',
    title: 'Start hopping',
    description: "You're all set! Create your first pull zone or storage zone to get started.",
    actionLabel: 'Create first zone',
    required: true,
  },
];

// Helper function to get default user state for new users
export function getDefaultUserState(name: string, email: string): UserState {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 30);

  return {
    id: `user-${Date.now()}`,
    name,
    email,
    emailVerified: false,
    onboarding: {
      currentStep: 'confirm-email',
      steps: [
        { step: 'confirm-email', status: 'in-progress', required: true },
        { step: 'personal-info', status: 'pending', required: false },
        { step: 'credit-card', status: 'pending', required: false },
        { step: 'start-hopping', status: 'pending', required: true },
      ],
    },
    trial: {
      isActive: true,
      startDate: new Date().toISOString(),
      endDate: trialEndDate.toISOString(),
      credits: 20.0,
      usedCredits: 0,
      bonusCreditsAvailable: 30,
      bonusCreditsClaimed: false,
    },
    activeProducts: [],
    productUsage: [],
    preferences: {
      showCosts: true,
      defaultTimeRange: '24h',
      compactMode: false,
    },
    dashboardLayouts: {} as Record<DashboardType, WidgetPosition[]>,
    // NEW: Default favourites and notifications
    favourites: [],
    notifications: {
      notifications: [],
      unreadCount: 0,
      lastChecked: new Date().toISOString(),
    },
  };
}

// Bunny.net Product Types
export type BunnyProduct =
  | 'cdn'
  | 'stream'
  | 'storage'
  | 'dns'
  | 'optimizer'
  | 'shield'
  | 'edge-scripting'
  | 'magic-containers';

// Dashboard type based on primary use case
export type DashboardType = 'video' | 'website' | 'api' | 'security' | 'storage' | 'cdn' | 'dns' | 'stream' | 'purge' | 'statistics' | 'full';

// Widget size for grid layout
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

// Widget position in the grid
export interface WidgetPosition {
  id: string;
  order: number;
  size: WidgetSize;
}

// User preferences
export interface UserPreferences {
  showCosts: boolean;
  defaultTimeRange: '24h' | '7d' | '30d';
  compactMode: boolean;
}

// Product usage data for auto-detection
export interface ProductUsage {
  product: BunnyProduct;
  bandwidthLast30d: number; // in GB
  costLast30d: number; // in USD
  activityScore: number; // 0-100 based on recent activity
  isActive: boolean;
}

// User profile with active products and preferences
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  activeProducts: BunnyProduct[];
  productUsage: ProductUsage[];
  preferences: UserPreferences;
  dashboardLayouts: Record<DashboardType, WidgetPosition[]>;
}

// Widget definition for the dashboard
export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  size: WidgetSize;
  products: BunnyProduct[]; // Which products this widget is relevant for
  component: string; // Component name to render
}

// Available widgets for each dashboard type
export const DASHBOARD_WIDGETS: Record<DashboardType, WidgetDefinition[]> = {
  video: [
    // Row 1: 3 key metrics (am I growing?)
    { id: 'total-views', name: 'Total Views', description: 'Views over time', size: 'medium', products: ['stream'], component: 'TotalViewsWidget' },
    { id: 'watch-time', name: 'Watch Time', description: 'Hours watched', size: 'medium', products: ['stream'], component: 'WatchTimeWidget' },
    { id: 'storage-usage', name: 'Storage Used', description: 'Storage quota', size: 'medium', products: ['storage'], component: 'StorageUsageWidget' },
    // Row 2: Resources (my stuff)
    { id: 'video-library', name: 'Video Libraries', description: 'Your video libraries', size: 'large', products: ['stream', 'storage'], component: 'VideoLibraryWidget' },
    { id: 'storage-zones', name: 'Storage Zones', description: 'Your storage zones', size: 'large', products: ['storage'], component: 'StorageZonesWidget' },
    // Row 3: Activity (conditional - only shows when active)
    { id: 'live-stream-status', name: 'Live Stream', description: 'Active live stream', size: 'large', products: ['stream'], component: 'LiveStreamStatusWidget' },
    { id: 'encoding-queue', name: 'Encoding Queue', description: 'Videos being processed', size: 'large', products: ['stream'], component: 'EncodingQueueWidget' },
    // Bottom: Quick Links
    { id: 'quick-links-video', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['stream', 'storage'], component: 'QuickLinksWidget' },
  ],
  website: [
    // Row 1: 3 hero metrics (medium = col-span-2)
    { id: 'website-bandwidth', name: 'Bandwidth', description: 'Total bandwidth served', size: 'medium', products: ['cdn'], component: 'CdnBandwidthWidget' },
    { id: 'website-cache-hit', name: 'Cache Hit Ratio', description: 'Cache performance', size: 'medium', products: ['cdn'], component: 'CdnCacheHitWidget' },
    { id: 'website-optimizer', name: 'Optimizer Savings', description: 'Bandwidth saved by optimization', size: 'medium', products: ['optimizer'], component: 'OptimizerSavingsWidget' },
    // Row 2: Pull Zones (full width)
    { id: 'website-pull-zones', name: 'Pull Zones', description: 'Manage your pull zones', size: 'full', products: ['cdn'], component: 'CdnPullZonesListWidget' },
    // Row 3: Traffic + Performance (large = col-span-3)
    { id: 'website-traffic', name: 'Traffic', description: 'Traffic over time', size: 'large', products: ['cdn'], component: 'CdnTrafficChartWidget' },
    { id: 'website-performance', name: 'Performance Score', description: 'Site speed metrics', size: 'large', products: ['cdn', 'optimizer'], component: 'PerformanceScoreWidget' },
    { id: 'quick-links-website', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['cdn', 'optimizer'], component: 'QuickLinksWidget' },
  ],
  api: [
    // Row 1: 3 hero metrics (medium = col-span-2)
    { id: 'api-executions', name: 'Edge Executions', description: 'Function invocations (24h)', size: 'medium', products: ['edge-scripting'], component: 'EdgeExecutionsWidget' },
    { id: 'api-error-rate', name: 'Error Rate', description: 'Error percentage', size: 'medium', products: ['edge-scripting'], component: 'ErrorRateWidget' },
    { id: 'api-latency', name: 'p95 Latency', description: 'Response time', size: 'medium', products: ['edge-scripting'], component: 'LatencyWidget' },
    // Row 2: Scripts & Containers table (full width)
    { id: 'api-resources', name: 'Scripts & Containers', description: 'Active deployments', size: 'full', products: ['edge-scripting', 'magic-containers'], component: 'ApiResourcesWidget' },
    // Row 3: Recent errors (full width)
    { id: 'api-errors', name: 'Recent Errors', description: 'Latest error log entries', size: 'full', products: ['edge-scripting', 'magic-containers'], component: 'ApiErrorsWidget' },
    { id: 'quick-links-api', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['edge-scripting', 'magic-containers'], component: 'QuickLinksWidget' },
  ],
  security: [
    // Row 1: 3 hero metrics (am I under attack?)
    { id: 'threats-blocked', name: 'Threats Blocked', description: 'Total malicious requests blocked', size: 'medium', products: ['shield'], component: 'ThreatsBlockedWidget' },
    { id: 'ddos-status', name: 'DDoS Status', description: 'Current attack status', size: 'medium', products: ['shield'], component: 'DdosStatusWidget' },
    { id: 'waf-requests', name: 'WAF Requests', description: 'WAF-blocked requests', size: 'medium', products: ['shield'], component: 'WafRequestsWidget' },
    // Row 2: Shield AI (what should I do?)
    { id: 'shield-ai', name: 'Shield AI', description: 'AI-powered security recommendations', size: 'full', products: ['shield'], component: 'ShieldAIWidget' },
    // Row 3: Attack trend (what happened recently?)
    { id: 'attack-overview', name: 'Volume of Attacks Over Time', description: 'Multi-line chart showing DDoS, WAF, and Rate Limit attacks', size: 'full', products: ['shield'], component: 'AttackOverviewWidget' },
    { id: 'quick-links-security', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['shield'], component: 'QuickLinksWidget' },
  ],
  storage: [
    // Row 1: 3 hero metrics (medium = col-span-2)
    { id: 'storage-total', name: 'Total Storage', description: 'Storage used across all zones', size: 'medium', products: ['storage'], component: 'StorageTotalWidget' },
    { id: 'files-count', name: 'Files', description: 'Total files stored', size: 'medium', products: ['storage'], component: 'FilesCountWidget' },
    { id: 'storage-bandwidth', name: 'Bandwidth', description: 'Storage bandwidth usage', size: 'medium', products: ['storage'], component: 'StorageBandwidthWidget' },
    // Row 2: Storage Zones (full width)
    { id: 'storage-zones-list', name: 'Storage Zones', description: 'All your storage zones', size: 'full', products: ['storage'], component: 'StorageZonesListWidget' },
    // Row 3: Recent Uploads (full width)
    { id: 'recent-uploads', name: 'Recent Uploads', description: 'Latest uploaded files', size: 'full', products: ['storage'], component: 'RecentUploadsWidget' },
    { id: 'quick-links-storage', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['storage'], component: 'QuickLinksWidget' },
  ],
  cdn: [
    // Row 1: 3 hero metrics (medium = col-span-2)
    { id: 'cdn-bandwidth', name: 'Bandwidth', description: 'Total bandwidth served', size: 'medium', products: ['cdn'], component: 'CdnBandwidthWidget' },
    { id: 'cdn-requests', name: 'Requests', description: 'Total requests', size: 'medium', products: ['cdn'], component: 'CdnRequestsWidget' },
    { id: 'cdn-cache-hit', name: 'Cache Hit Ratio', description: 'Cache performance', size: 'medium', products: ['cdn'], component: 'CdnCacheHitWidget' },
    // Row 2: Pull Zones List (full width)
    { id: 'cdn-pull-zones-list', name: 'Pull Zones', description: 'Manage your pull zones', size: 'full', products: ['cdn'], component: 'CdnPullZonesListWidget' },
    // Row 3: 2 cards (large = col-span-3)
    { id: 'cdn-traffic-chart', name: 'Traffic', description: 'Traffic over time', size: 'large', products: ['cdn'], component: 'CdnTrafficChartWidget' },
    { id: 'cdn-geographic', name: 'Geographic Distribution', description: 'Traffic by region', size: 'large', products: ['cdn'], component: 'CdnGeographicWidget' },
    { id: 'quick-links-cdn', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['cdn'], component: 'QuickLinksWidget' },
  ],
  dns: [
    // Row 1: 3 hero metrics
    { id: 'dns-overview', name: 'DNS Overview', description: 'Total zones and records', size: 'medium', products: ['dns'], component: 'DnsOverviewWidget' },
    { id: 'dns-queries', name: 'DNS Queries', description: 'Query volume', size: 'medium', products: ['dns'], component: 'DnsQueriesWidget' },
    { id: 'dns-response-time', name: 'Response Time', description: 'DNS resolution latency', size: 'medium', products: ['dns'], component: 'DnsResponseTimeWidget' },
    // Row 2: DNS Zones Table (full width - the main thing users come here for)
    { id: 'dns-zones-table', name: 'DNS Zones', description: 'Manage your DNS zones', size: 'full', products: ['dns'], component: 'DnsZonesTableWidget' },
    { id: 'quick-links-dns', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['dns'], component: 'QuickLinksWidget' },
  ],
  stream: [
    // Row 1: 3 hero metrics
    { id: 'stream-views', name: 'Total Views', description: 'Video views', size: 'medium', products: ['stream'], component: 'StreamViewsWidget' },
    { id: 'stream-bandwidth', name: 'Bandwidth', description: 'Streaming bandwidth', size: 'medium', products: ['stream'], component: 'StreamBandwidthWidget' },
    { id: 'stream-encoding', name: 'Encoding Status', description: 'Video encoding jobs', size: 'medium', products: ['stream'], component: 'StreamEncodingWidget' },
    // Row 2: Video Libraries Table (full width)
    { id: 'stream-libraries-table', name: 'Video Libraries', description: 'Manage your libraries', size: 'full', products: ['stream'], component: 'StreamLibrariesTableWidget' },
    // Row 3: Analytics
    { id: 'stream-playback-chart', name: 'Playback Stats', description: 'Views over time', size: 'large', products: ['stream'], component: 'StreamPlaybackChartWidget' },
    { id: 'stream-quality', name: 'Quality Metrics', description: 'Playback quality', size: 'large', products: ['stream'], component: 'StreamQualityWidget' },
    { id: 'quick-links-stream', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['stream'], component: 'QuickLinksWidget' },
  ],
  purge: [
    // Row 1: 2 hero metrics (medium = col-span-2) + action card
    { id: 'purge-stats', name: 'Purge Statistics', description: 'Recent purge activity', size: 'medium', products: ['cdn'], component: 'PurgeStatsWidget' },
    { id: 'purge-queue', name: 'Purge Queue', description: 'Pending purges', size: 'medium', products: ['cdn'], component: 'PurgeQueueWidget' },
    { id: 'purge-quick-action', name: 'Quick Purge', description: 'Purge cache quickly', size: 'medium', products: ['cdn'], component: 'PurgeQuickActionWidget' },
    // Row 2: Purge History Table (full width)
    { id: 'purge-history', name: 'Purge History', description: 'Recent purge operations', size: 'full', products: ['cdn'], component: 'PurgeHistoryWidget' },
    { id: 'quick-links-purge', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['cdn'], component: 'QuickLinksWidget' },
  ],
  statistics: [
    // Row 1: 4 hero metrics (medium = col-span-2)
    { id: 'stats-bandwidth', name: 'Total Bandwidth', description: 'Bandwidth across all products', size: 'medium', products: ['cdn', 'storage', 'stream'], component: 'StatsBandwidthWidget' },
    { id: 'stats-requests', name: 'Total Requests', description: 'Requests across all products', size: 'medium', products: ['cdn'], component: 'StatsRequestsWidget' },
    { id: 'stats-cost', name: 'Total Cost', description: 'Cost across all products', size: 'medium', products: ['cdn', 'storage', 'stream'], component: 'StatsCostWidget' },
    // Row 2: Traffic Chart (full width)
    { id: 'stats-traffic-chart', name: 'Traffic Overview', description: 'Bandwidth over time', size: 'full', products: ['cdn', 'storage', 'stream'], component: 'StatsTrafficChartWidget' },
    // Row 3: 2 cards (large = col-span-3)
    { id: 'stats-geographic', name: 'Geographic Distribution', description: 'Traffic by region', size: 'large', products: ['cdn'], component: 'StatsGeographicWidget' },
    { id: 'stats-top-content', name: 'Top Content', description: 'Most requested content', size: 'large', products: ['cdn'], component: 'StatsTopContentWidget' },
    { id: 'quick-links-stats', name: 'Quick Links', description: 'Shortcuts', size: 'full', products: ['cdn', 'storage', 'stream'], component: 'QuickLinksWidget' },
  ],
  full: [
    // Row 1: Alerts & Health (full width, only shows if issues exist)
    { id: 'alerts', name: 'Alerts & Insights', description: 'System notifications', size: 'full', products: ['cdn', 'stream', 'storage', 'shield'], component: 'AlertsWidget' },
    // Row 2: 4 key metrics (medium = col-span-2, leaving last 2 cols empty is fine)
    { id: 'cdn-requests-mini', name: 'Bandwidth', description: 'Total bandwidth (24h)', size: 'medium', products: ['cdn'], component: 'MiniStatCard' },
    { id: 'vod-views-mini', name: 'Requests', description: 'Total requests', size: 'medium', products: ['cdn', 'stream'], component: 'MiniStatCard' },
    { id: 'stored-mini', name: 'Cache Hit Rate', description: 'Cache performance', size: 'medium', products: ['cdn'], component: 'MiniStatCard' },
    // Row 3: Top 2 resource lists (large = col-span-3)
    { id: 'pull-zones-list', name: 'Pull Zones', description: 'Your pull zones', size: 'large', products: ['cdn'], component: 'PullZonesListWidget' },
    { id: 'storage-zones-overview', name: 'Storage Zones', description: 'Your storage zones', size: 'large', products: ['storage'], component: 'StorageZonesWidget' },
  ],
};

// Default layouts for each dashboard type
export function getDefaultLayout(dashboardType: DashboardType): WidgetPosition[] {
  const widgets = DASHBOARD_WIDGETS[dashboardType];
  return widgets.map((widget, index) => ({
    id: widget.id,
    order: index,
    size: widget.size,
  }));
}
