'use client';

import { useState } from 'react';
import FaIcon from '../FaIcon';

interface Preset<T = Record<string, unknown>> {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of what this preset is for */
  description: string;
  /** The configuration values */
  settings: T;
  /** Whether this is the recommended option */
  recommended?: boolean;
  /** Optional icon */
  icon?: string;
  /** Optional badge text (e.g., "Popular", "New") */
  badge?: string;
}

interface ConfigPresetsProps<T = Record<string, unknown>> {
  /** Available presets */
  presets: Preset<T>[];
  /** Currently selected preset ID (if any) */
  selectedId?: string;
  /** Callback when a preset is selected */
  onSelect: (preset: Preset<T>) => void;
  /** Title for the preset section */
  title?: string;
  /** Whether to show preset descriptions */
  showDescriptions?: boolean;
  /** Layout variant */
  layout?: 'grid' | 'list';
}

/**
 * ConfigPresets - Quick configuration selector
 *
 * Helps users quickly configure settings using pre-defined templates.
 * Reduces cognitive load and speeds up setup.
 */
export function ConfigPresets<T = Record<string, unknown>>({
  presets,
  selectedId,
  onSelect,
  title = 'Quick Setup',
  showDescriptions = true,
  layout = 'grid',
}: ConfigPresetsProps<T>) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerClasses =
    layout === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
      : 'flex flex-col gap-2';

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <FaIcon icon="fa-wand-magic-sparkles" className="text-sm text-[#1870c6]" ariaLabel="" />
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
      )}

      <div className={containerClasses}>
        {presets.map((preset) => {
          const isSelected = selectedId === preset.id;
          const isHovered = hoveredId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              onMouseEnter={() => setHoveredId(preset.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                relative text-left p-4 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : isHovered
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <FaIcon icon="fa-check" className="text-xs text-white" ariaLabel="Selected" />
                  </div>
                </div>
              )}

              {/* Recommended badge */}
              {preset.recommended && !isSelected && (
                <div className="absolute -top-2 left-3">
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-emerald-500 text-white rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              {/* Custom badge */}
              {preset.badge && !preset.recommended && !isSelected && (
                <div className="absolute -top-2 left-3">
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[#1870c6] text-white rounded-full">
                    {preset.badge}
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3">
                {preset.icon && (
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                    `}
                  >
                    <FaIcon
                      icon={preset.icon}
                      className={`text-lg ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}
                      ariaLabel=""
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-medium ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}
                  >
                    {preset.name}
                  </h4>
                  {showDescriptions && (
                    <p
                      className={`mt-0.5 text-xs ${
                        isSelected ? 'text-blue-700' : 'text-gray-500'
                      }`}
                    >
                      {preset.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===========================================
// Example Preset Collections
// ===========================================

export interface PullZoneSettings {
  cacheExpiry: number;
  optimizeImages: boolean;
  enableBrotli: boolean;
  enableHttp2: boolean;
  originShield: boolean;
  wafEnabled: boolean;
}

export const PULL_ZONE_PRESETS: Preset<PullZoneSettings>[] = [
  {
    id: 'static-website',
    name: 'Static Website',
    description: 'Optimized for blogs, landing pages, and documentation sites',
    icon: 'fa-globe',
    recommended: true,
    settings: {
      cacheExpiry: 86400, // 1 day
      optimizeImages: true,
      enableBrotli: true,
      enableHttp2: true,
      originShield: false,
      wafEnabled: false,
    },
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Balance between fresh content and performance',
    icon: 'fa-cart-shopping',
    settings: {
      cacheExpiry: 3600, // 1 hour
      optimizeImages: true,
      enableBrotli: true,
      enableHttp2: true,
      originShield: true,
      wafEnabled: true,
    },
  },
  {
    id: 'api',
    name: 'API / Dynamic',
    description: 'For frequently changing content and APIs',
    icon: 'fa-code',
    settings: {
      cacheExpiry: 60, // 1 minute
      optimizeImages: false,
      enableBrotli: true,
      enableHttp2: true,
      originShield: true,
      wafEnabled: true,
    },
  },
  {
    id: 'media-streaming',
    name: 'Media Streaming',
    description: 'Optimized for video and large file delivery',
    icon: 'fa-play-circle',
    badge: 'Popular',
    settings: {
      cacheExpiry: 604800, // 1 week
      optimizeImages: false,
      enableBrotli: false,
      enableHttp2: true,
      originShield: true,
      wafEnabled: false,
    },
  },
];

export interface ReplicationSettings {
  regions: string[];
  priority: 'speed' | 'cost' | 'balanced';
}

export const REPLICATION_PRESETS: Preset<ReplicationSettings>[] = [
  {
    id: 'global',
    name: 'Global Coverage',
    description: 'Replicate to all major regions worldwide',
    icon: 'fa-earth-americas',
    settings: {
      regions: ['eu-west', 'us-east', 'us-west', 'asia-east', 'asia-south'],
      priority: 'speed',
    },
  },
  {
    id: 'cost-optimized',
    name: 'Cost Optimized',
    description: 'Single region with edge caching',
    icon: 'fa-piggy-bank',
    recommended: true,
    settings: {
      regions: ['eu-west'],
      priority: 'cost',
    },
  },
  {
    id: 'us-focused',
    name: 'US Focused',
    description: 'Optimized for North American traffic',
    icon: 'fa-flag-usa',
    settings: {
      regions: ['us-east', 'us-west'],
      priority: 'balanced',
    },
  },
];

export default ConfigPresets;
