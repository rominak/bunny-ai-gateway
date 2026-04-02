import { Notification, NotificationState } from '../types/userProfile';

// ===========================================
// Mock Account Event Notifications
// ===========================================

export const MOCK_ACCOUNT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    category: 'account',
    severity: 'critical',
    title: 'Origin server errors detected',
    message: 'Pull zone "legacy-api" origin is returning 502 Bad Gateway errors. 847 errors in the last 24 hours.',
    timestamp: '5 min ago',
    read: false,
    resourceId: 'pz-3',
    resourceType: 'pull-zone',
    actionLabel: 'View errors',
    actionUrl: '/cdn/pz-3/errors',
  },
  {
    id: 'notif-2',
    category: 'account',
    severity: 'warning',
    title: 'SSL certificate expiring soon',
    message: 'Certificate for staging-cdn.example.com will expire in 7 days. Renew now to avoid service interruption.',
    timestamp: '2 hours ago',
    read: false,
    resourceId: 'pz-2',
    resourceType: 'pull-zone',
    actionLabel: 'Renew certificate',
    actionUrl: '/cdn/pz-2/ssl',
  },
  {
    id: 'notif-3',
    category: 'account',
    severity: 'warning',
    title: 'Video encoding failed',
    message: '3 videos in "Course Content" library failed to encode. Check source files and retry.',
    timestamp: '1 hour ago',
    read: false,
    resourceId: 'vl-2',
    resourceType: 'video-library',
    actionLabel: 'View failed videos',
    actionUrl: '/stream/vl-2/encoding',
  },
  {
    id: 'notif-4',
    category: 'account',
    severity: 'warning',
    title: 'Low account balance',
    message: 'Your account balance ($12.45) will run out in approximately 5 days at your current usage rate.',
    timestamp: '3 hours ago',
    read: true,
    actionLabel: 'Add funds',
    actionUrl: '/account/billing',
  },
  {
    id: 'notif-5',
    category: 'account',
    severity: 'info',
    title: 'Storage replication complete',
    message: 'Geo-replication for "media-storage" zone to EU-West region completed successfully.',
    timestamp: '6 hours ago',
    read: true,
    resourceId: 'sz-1',
    resourceType: 'storage-zone',
  },
  {
    id: 'notif-6',
    category: 'account',
    severity: 'success',
    title: 'Payment processed',
    message: 'Your account was recharged with $50.00. New balance: $62.45.',
    timestamp: '1 day ago',
    read: true,
    actionLabel: 'View receipt',
    actionUrl: '/account/billing/history',
  },
];

// ===========================================
// Mock Incident Notifications
// ===========================================

export const MOCK_INCIDENT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-inc-1',
    category: 'incidents',
    severity: 'warning',
    title: 'Scheduled maintenance',
    message: 'EU-West data center scheduled for maintenance on Dec 28, 2025 from 02:00-04:00 UTC. Expect brief latency increases.',
    timestamp: '1 day ago',
    read: false,
    actionLabel: 'View status page',
    actionUrl: 'https://status.bunny.net',
  },
  {
    id: 'notif-inc-2',
    category: 'incidents',
    severity: 'success',
    title: 'Incident resolved',
    message: 'The API latency issues affecting the US-East region have been resolved. All systems operating normally.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: 'notif-inc-3',
    category: 'incidents',
    severity: 'info',
    title: 'Performance improvement',
    message: 'We\'ve upgraded our Singapore PoP. Expect up to 20% faster response times for APAC traffic.',
    timestamp: '3 days ago',
    read: true,
  },
];

// ===========================================
// Mock Product Update Notifications
// ===========================================

export const MOCK_PRODUCT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-prod-1',
    category: 'product-updates',
    severity: 'info',
    title: 'New: AI-powered image optimization',
    message: 'Bunny Optimizer now includes AI-powered image compression. Enable in your pull zone settings.',
    timestamp: '2 days ago',
    read: false,
    actionLabel: 'Learn more',
    actionUrl: '/docs/optimizer/ai',
  },
  {
    id: 'notif-prod-2',
    category: 'product-updates',
    severity: 'info',
    title: 'Stream: Multi-language captions',
    message: 'Automatically generate captions in 50+ languages with our new AI transcription feature.',
    timestamp: '5 days ago',
    read: true,
    actionLabel: 'Enable for your library',
    actionUrl: '/stream/settings/transcription',
  },
  {
    id: 'notif-prod-3',
    category: 'product-updates',
    severity: 'info',
    title: 'Shield AI is now available',
    message: 'Protect your CDN with AI-powered threat detection and automatic DDoS mitigation.',
    timestamp: '1 week ago',
    read: true,
    actionLabel: 'Try Shield AI',
    actionUrl: '/shield/enable',
  },
  {
    id: 'notif-prod-4',
    category: 'product-updates',
    severity: 'info',
    title: 'Edge Scripting: TypeScript support',
    message: 'You can now write your edge scripts in TypeScript with full type checking.',
    timestamp: '2 weeks ago',
    read: true,
    actionLabel: 'View documentation',
    actionUrl: '/docs/edge-scripting/typescript',
  },
];

// ===========================================
// Combined Notifications
// ===========================================

export const ALL_MOCK_NOTIFICATIONS: Notification[] = [
  ...MOCK_ACCOUNT_NOTIFICATIONS,
  ...MOCK_INCIDENT_NOTIFICATIONS,
  ...MOCK_PRODUCT_NOTIFICATIONS,
].sort((a, b) => {
  // Sort by read status (unread first), then by recency
  if (a.read !== b.read) return a.read ? 1 : -1;
  // Simple timestamp comparison (in real app, would parse dates)
  return 0;
});

export const MOCK_NOTIFICATION_STATE: NotificationState = {
  notifications: ALL_MOCK_NOTIFICATIONS,
  unreadCount: ALL_MOCK_NOTIFICATIONS.filter(n => !n.read).length,
  lastChecked: new Date().toISOString(),
};

// ===========================================
// Helper Functions
// ===========================================

export function getNotificationsByCategory(
  notifications: Notification[],
  category: Notification['category']
): Notification[] {
  return notifications.filter(n => n.category === category);
}

export function getUnreadNotifications(notifications: Notification[]): Notification[] {
  return notifications.filter(n => !n.read);
}

export function getUnreadCountByCategory(
  notifications: Notification[]
): Record<Notification['category'], number> {
  return {
    account: notifications.filter(n => n.category === 'account' && !n.read).length,
    incidents: notifications.filter(n => n.category === 'incidents' && !n.read).length,
    'product-updates': notifications.filter(n => n.category === 'product-updates' && !n.read).length,
  };
}
