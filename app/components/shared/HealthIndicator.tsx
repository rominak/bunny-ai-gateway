'use client';

import { HealthStatus } from '../../types/userProfile';
import { useState } from 'react';

interface HealthIndicatorProps {
  status: HealthStatus;
  label?: string;
  details?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
}

const STATUS_CONFIG: Record<HealthStatus, {
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  icon: string;
}> = {
  healthy: {
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    label: 'Healthy',
    icon: '●',
  },
  warning: {
    color: 'text-[#f59e0b]',
    bgColor: 'bg-[#f59e0b]',
    borderColor: 'border-amber-200',
    label: 'Warning',
    icon: '●',
  },
  error: {
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-200',
    label: 'Error',
    icon: '●',
  },
};

const SIZE_CONFIG = {
  sm: {
    dot: 'w-[6px] h-[6px]',
    pill: 'text-xs px-2 py-0.5',
    text: 'text-xs',
  },
  md: {
    dot: 'w-[8px] h-[8px]',
    pill: 'text-sm px-2.5 py-1',
    text: 'text-sm',
  },
  lg: {
    dot: 'w-[10px] h-[10px]',
    pill: 'text-base px-3 py-1.5',
    text: 'text-base',
  },
};

export function HealthIndicator({
  status,
  label,
  details,
  size = 'sm',
  showLabel = false,
  showTooltip = true,
}: HealthIndicatorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];

  const displayLabel = label || config.label;

  return (
    <div
      className="relative inline-flex items-center gap-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated dot with pulse effect for errors */}
      <span className="relative flex items-center justify-center">
        <span
          className={`${sizeConfig.dot} ${config.bgColor} rounded-full`}
        />
        {status === 'error' && (
          <span
            className={`absolute ${sizeConfig.dot} ${config.bgColor} rounded-full animate-ping opacity-75`}
          />
        )}
      </span>

      {/* Optional label */}
      {showLabel && (
        <span className={`${sizeConfig.text} ${config.color} font-medium`}>
          {displayLabel}
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && isHovered && (details || !showLabel) && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
                     bg-[var(--bg-bunny-dark)] text-white text-xs rounded-lg shadow-lg
                     whitespace-nowrap pointer-events-none"
          role="tooltip"
        >
          <div className="font-medium">{displayLabel}</div>
          {details && (
            <div className="text-gray-300 mt-0.5">{details}</div>
          )}
          {/* Tooltip arrow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px
                       border-4 border-transparent border-t-[var(--bg-bunny-dark)]"
          />
        </div>
      )}
    </div>
  );
}

// ===========================================
// Health Pill Variant (for tables/lists)
// ===========================================

interface HealthPillProps {
  status: HealthStatus;
  size?: 'sm' | 'md';
}

export function HealthPill({ status, size = 'sm' }: HealthPillProps) {
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizeConfig.pill}
                  ${config.color} bg-opacity-10 rounded-full font-medium
                  border ${config.borderColor}`}
      style={{
        backgroundColor: status === 'healthy'
          ? 'rgba(16, 185, 129, 0.1)'
          : status === 'warning'
            ? 'rgba(245, 158, 11, 0.1)'
            : 'rgba(239, 68, 68, 0.1)',
      }}
    >
      <span className={`w-[6px] h-[6px] ${config.bgColor} rounded-full`} />
      {config.label}
    </span>
  );
}

// ===========================================
// Health Summary Badge (for dashboards)
// ===========================================

interface HealthSummaryBadgeProps {
  healthy: number;
  warning: number;
  error: number;
  onClick?: () => void;
}

export function HealthSummaryBadge({
  healthy,
  warning,
  error,
  onClick,
}: HealthSummaryBadgeProps) {
  const total = healthy + warning + error;

  // Determine overall status
  let overallStatus: HealthStatus = 'healthy';
  if (error > 0) overallStatus = 'error';
  else if (warning > 0) overallStatus = 'warning';

  const config = STATUS_CONFIG[overallStatus];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                  border ${config.borderColor} hover:bg-[#eef4fe] transition-colors
                  ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={{
        backgroundColor: overallStatus === 'healthy'
          ? 'rgba(16, 185, 129, 0.05)'
          : overallStatus === 'warning'
            ? 'rgba(245, 158, 11, 0.05)'
            : 'rgba(239, 68, 68, 0.05)',
      }}
    >
      <HealthIndicator status={overallStatus} showTooltip={false} />
      <span className="text-sm font-medium text-gray-700">
        {total} resource{total !== 1 ? 's' : ''}
      </span>
      {(warning > 0 || error > 0) && (
        <span className="text-xs text-gray-500">
          ({error > 0 && <span className="text-red-600">{error} error{error !== 1 ? 's' : ''}</span>}
          {error > 0 && warning > 0 && ', '}
          {warning > 0 && <span className="text-[#f59e0b]">{warning} warning{warning !== 1 ? 's' : ''}</span>})
        </span>
      )}
    </button>
  );
}

export default HealthIndicator;
