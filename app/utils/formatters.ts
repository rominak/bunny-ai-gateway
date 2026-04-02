/**
 * Utility functions for formatting values and handling edge cases
 */

/**
 * Calculates percentage change between two values safely.
 * Handles edge cases like zero values, NaN, and Infinity.
 *
 * @param current Current value
 * @param previous Previous value
 * @returns Formatted change string (e.g., "+5.2%", "-3.1%", "No change", "New")
 */
export function calculatePercentageChange(
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

/**
 * Formats a number as a human-readable string with abbreviations.
 * e.g., 1234 -> "1.2K", 1234567 -> "1.2M"
 *
 * @param value Number to format
 * @param decimals Number of decimal places (default 1)
 * @returns Formatted string
 */
export function formatNumber(value: number, decimals: number = 1): string {
  if (value === 0) return '0';

  const absValue = Math.abs(value);

  if (absValue >= 1000000000) {
    return `${(value / 1000000000).toFixed(decimals)}B`;
  }

  if (absValue >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  }

  if (absValue >= 1000) {
    return `${(value / 1000).toFixed(decimals)}K`;
  }

  return value.toFixed(decimals).replace(/\.0+$/, '');
}

/**
 * Formats bytes as human-readable string.
 * e.g., 1024 -> "1 KB", 1073741824 -> "1 GB"
 *
 * @param bytes Number of bytes
 * @param decimals Number of decimal places (default 1)
 * @returns Formatted string
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Formats a duration in seconds as human-readable string.
 * e.g., 3600 -> "1 hour", 7200 -> "2 hours"
 *
 * @param seconds Duration in seconds
 * @returns Formatted string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} sec`;
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  }

  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);

  if (remainingMinutes === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Formats a currency value.
 *
 * @param value Number to format
 * @param currency Currency code (default 'USD')
 * @returns Formatted string
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Gets a trend description for accessibility.
 *
 * @param change Change object from calculatePercentageChange
 * @param metric Name of the metric being described
 * @returns Accessible description string
 */
export function getTrendDescription(
  change: { value: string; type: 'up' | 'down' | 'neutral' },
  metric: string
): string {
  if (change.type === 'neutral') {
    return `${metric} has not changed`;
  }

  const direction = change.type === 'up' ? 'increased' : 'decreased';
  return `${metric} has ${direction} by ${change.value}`;
}
