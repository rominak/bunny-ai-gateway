'use client';

import { useMemo } from 'react';
import { BunnyProduct, DashboardType, ProductUsage } from '../types/userProfile';

interface UseDashboardTypeOptions {
  activeProducts: BunnyProduct[];
  productUsage?: ProductUsage[];
}

// Product combinations that indicate specific dashboard types
const DASHBOARD_INDICATORS: Record<DashboardType, BunnyProduct[][]> = {
  video: [
    ['stream', 'storage'],
    ['stream'],
  ],
  storage: [
    ['storage'],
  ],
  cdn: [
    ['cdn'],
  ],
  dns: [
    ['dns'],
  ],
  stream: [
    ['stream'],
  ],
  purge: [], // Utility dashboard, not auto-detected
  statistics: [], // Analytics dashboard, not auto-detected
  website: [
    ['cdn', 'optimizer'],
    ['cdn', 'dns'],
  ],
  api: [
    ['edge-scripting', 'cdn'],
    ['magic-containers'],
    ['edge-scripting'],
  ],
  security: [
    ['shield', 'cdn'],
    ['shield'],
  ],
  full: [], // Fallback when many products are active
};

// Score each product by usage
function scoreProducts(productUsage: ProductUsage[]): Map<BunnyProduct, number> {
  const scores = new Map<BunnyProduct, number>();

  for (const usage of productUsage) {
    if (!usage.isActive) continue;

    // Weighted score: 40% bandwidth, 40% cost, 20% activity
    const score =
      (usage.bandwidthLast30d * 0.4) +
      (usage.costLast30d * 0.4) +
      (usage.activityScore * 0.2);

    scores.set(usage.product, score);
  }

  return scores;
}

// Check if products match a combination pattern
function matchesCombination(activeProducts: BunnyProduct[], combination: BunnyProduct[]): boolean {
  return combination.every(product => activeProducts.includes(product));
}

// Determine dashboard type based on active products
function detectDashboardType(
  activeProducts: BunnyProduct[],
  productUsage?: ProductUsage[]
): DashboardType {
  // If many products are active (4+), use full dashboard
  if (activeProducts.length >= 4) {
    return 'full';
  }

  // If we have usage data, use scores to determine primary product
  if (productUsage && productUsage.length > 0) {
    const scores = scoreProducts(productUsage);
    const sortedProducts = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([product]) => product);

    // Check which dashboard type matches the highest-scored products
    for (const [dashboardType, combinations] of Object.entries(DASHBOARD_INDICATORS)) {
      if (dashboardType === 'full') continue;

      for (const combination of combinations) {
        if (combination.every(product => sortedProducts.slice(0, 3).includes(product))) {
          return dashboardType as DashboardType;
        }
      }
    }
  }

  // Fallback: check product combinations without scores
  for (const [dashboardType, combinations] of Object.entries(DASHBOARD_INDICATORS)) {
    if (dashboardType === 'full') continue;

    for (const combination of combinations) {
      if (matchesCombination(activeProducts, combination)) {
        return dashboardType as DashboardType;
      }
    }
  }

  // Default to website (CDN) dashboard if only CDN is active
  if (activeProducts.includes('cdn')) {
    return 'website';
  }

  // Ultimate fallback
  return 'full';
}

export function useDashboardType({ activeProducts, productUsage }: UseDashboardTypeOptions) {
  const dashboardType = useMemo(() => {
    return detectDashboardType(activeProducts, productUsage);
  }, [activeProducts, productUsage]);

  const dashboardName = useMemo(() => {
    const names: Record<DashboardType, string> = {
      video: 'Video Creator',
      storage: 'Storage Manager',
      cdn: 'CDN Manager',
      dns: 'DNS Manager',
      stream: 'Stream Manager',
      purge: 'Purge Cache',
      statistics: 'Statistics',
      website: 'Website Owner',
      api: 'API/App Developer',
      security: 'Security-First',
      full: 'Full Platform',
    };
    return names[dashboardType];
  }, [dashboardType]);

  const dashboardDescription = useMemo(() => {
    const descriptions: Record<DashboardType, string> = {
      video: 'Optimized for video streaming and storage',
      storage: 'Optimized for storage analytics and operations',
      cdn: 'Manage pull zones, traffic, and CDN performance',
      dns: 'Manage DNS zones, records, and DNSSEC',
      stream: 'Manage video libraries, encoding, and playback',
      purge: 'Clear cached content from the CDN',
      statistics: 'Analytics across all Bunny.net services',
      website: 'Optimized for website delivery and optimization',
      api: 'Optimized for API and edge computing',
      security: 'Optimized for security and threat protection',
      full: 'Overview of all Bunny.net services',
    };
    return descriptions[dashboardType];
  }, [dashboardType]);

  return {
    dashboardType,
    dashboardName,
    dashboardDescription,
  };
}

export default useDashboardType;
