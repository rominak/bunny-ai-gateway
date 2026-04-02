'use client';

import FaIcon from '../FaIcon';

interface TrendBadgeProps {
  /** The change value to display (e.g., "+5.2%", "No change", "New") */
  value: string;
  /** The type of change: up (green), down (red), or neutral (gray) */
  type: 'up' | 'down' | 'neutral';
  /** Optional size variant */
  size?: 'sm' | 'md';
  /** Optional accessible label for the trend */
  ariaLabel?: string;
}

const TYPE_COLORS = {
  up: {
    bg: 'rgba(47, 197, 132, 0.15)',
    text: '#2fc584',
    icon: 'fa-arrow-up',
  },
  down: {
    bg: 'rgba(229, 69, 69, 0.15)',
    text: '#e54545',
    icon: 'fa-arrow-down',
  },
  neutral: {
    bg: 'rgba(104, 122, 139, 0.15)',
    text: '#687a8b',
    icon: '',
  },
};

const SIZE_CLASSES = {
  sm: {
    container: 'px-1.5 py-0.5',
    text: 'text-[10px]',
    icon: 'text-[8px]',
  },
  md: {
    container: 'px-2 py-1',
    text: 'text-[12px]',
    icon: 'text-[10px]',
  },
};

/**
 * TrendBadge - Displays percentage change with appropriate styling
 *
 * Handles edge cases like:
 * - "No change" for 0% change
 * - "New" for new metrics with no previous data
 * - "—" for undefined or incalculable values
 */
export function TrendBadge({
  value,
  type,
  size = 'md',
  ariaLabel,
}: TrendBadgeProps) {
  const colors = TYPE_COLORS[type];
  const sizes = SIZE_CLASSES[size];

  // Don't show icon for neutral or special values
  const showIcon = type !== 'neutral' && !['No change', 'New', '—', ''].includes(value);

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizes.container}`}
      style={{ backgroundColor: colors.bg }}
      role="status"
      aria-label={ariaLabel || `Change: ${value}`}
    >
      {showIcon && colors.icon && (
        <FaIcon
          icon={colors.icon}
          className={sizes.icon}
          style={{ color: colors.text }}
          ariaLabel=""
        />
      )}
      <span className={sizes.text} style={{ color: colors.text }}>
        {value}
      </span>
    </div>
  );
}

// Convenience components for common use cases

interface SimpleTrendBadgeProps {
  current: number;
  previous: number;
  size?: 'sm' | 'md';
  metricName?: string;
}

/**
 * SimpleTrendBadge - Automatically calculates and displays percentage change
 *
 * Usage:
 * <SimpleTrendBadge current={150} previous={100} /> // Shows "+50%"
 * <SimpleTrendBadge current={0} previous={0} /> // Shows "No change"
 * <SimpleTrendBadge current={100} previous={0} /> // Shows "New"
 */
export function SimpleTrendBadge({
  current,
  previous,
  size = 'md',
  metricName,
}: SimpleTrendBadgeProps) {
  const change = calculateChange(current, previous);

  return (
    <TrendBadge
      value={change.value}
      type={change.type}
      size={size}
      ariaLabel={metricName ? `${metricName} ${change.value}` : undefined}
    />
  );
}

/**
 * Calculates percentage change between two values safely.
 */
function calculateChange(
  current: number,
  previous: number
): { value: string; type: 'up' | 'down' | 'neutral' } {
  // Handle edge cases
  if (previous === 0 && current === 0) {
    return { value: 'No change', type: 'neutral' };
  }

  if (previous === 0 && current > 0) {
    return { value: 'New', type: 'up' };
  }

  if (previous === 0) {
    return { value: '—', type: 'neutral' };
  }

  const change = ((current - previous) / previous) * 100;

  // Handle NaN or Infinity
  if (!isFinite(change)) {
    return { value: '—', type: 'neutral' };
  }

  // Round to 1 decimal place
  const rounded = Math.round(change * 10) / 10;

  if (rounded === 0) {
    return { value: 'No change', type: 'neutral' };
  }

  const sign = rounded > 0 ? '+' : '';
  return {
    value: `${sign}${rounded}%`,
    type: rounded > 0 ? 'up' : 'down',
  };
}

export default TrendBadge;
