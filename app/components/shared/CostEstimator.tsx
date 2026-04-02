'use client';

import { useMemo } from 'react';
import FaIcon from '../FaIcon';

interface CostEstimatorProps {
  /** Base price per unit */
  basePrice: number;
  /** Unit label (e.g., "GB", "request", "hour") */
  unit: string;
  /** Current usage amount */
  currentUsage: number;
  /** Projected or planned usage amount */
  projectedUsage: number;
  /** Currency symbol */
  currency?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Whether to show the breakdown */
  showBreakdown?: boolean;
  /** Optional custom message format */
  messageFormat?: (cost: number, currency: string) => string;
}

/**
 * CostEstimator - Inline calculator for cost projections
 *
 * Shows users the cost impact of their decisions before they commit.
 * Example: "Adding 500 GB adds ~$5.00/month"
 */
export function CostEstimator({
  basePrice,
  unit,
  currentUsage,
  projectedUsage,
  currency = '$',
  decimals = 2,
  showBreakdown = false,
  messageFormat,
}: CostEstimatorProps) {
  const calculations = useMemo(() => {
    const additionalUsage = projectedUsage - currentUsage;
    const currentCost = currentUsage * basePrice;
    const projectedCost = projectedUsage * basePrice;
    const additionalCost = projectedCost - currentCost;

    return {
      additionalUsage,
      currentCost,
      projectedCost,
      additionalCost,
      isIncrease: additionalUsage > 0,
      isDecrease: additionalUsage < 0,
      noChange: additionalUsage === 0,
    };
  }, [basePrice, currentUsage, projectedUsage]);

  const formatCurrency = (value: number) => {
    return `${currency}${Math.abs(value).toFixed(decimals)}`;
  };

  const formatUsage = (value: number) => {
    return `${Math.abs(value).toLocaleString()} ${unit}`;
  };

  if (calculations.noChange) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FaIcon icon="fa-equals" className="text-xs" ariaLabel="" />
        <span>No change to estimated cost</span>
      </div>
    );
  }

  const message = messageFormat
    ? messageFormat(calculations.additionalCost, currency)
    : calculations.isIncrease
    ? `Adding ${formatUsage(calculations.additionalUsage)} adds ~${formatCurrency(calculations.additionalCost)}/month`
    : `Removing ${formatUsage(calculations.additionalUsage)} saves ~${formatCurrency(calculations.additionalCost)}/month`;

  const iconColor = calculations.isIncrease ? 'text-[#f59e0b]' : 'text-emerald-500';
  const bgColor = calculations.isIncrease ? 'bg-amber-50' : 'bg-emerald-50';
  const borderColor = calculations.isIncrease ? 'border-amber-200' : 'border-emerald-200';
  const textColor = calculations.isIncrease ? 'text-amber-700' : 'text-emerald-700';

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-3`}>
      <div className="flex items-start gap-2">
        <FaIcon
          icon={calculations.isIncrease ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}
          className={`text-sm mt-0.5 ${iconColor}`}
          ariaLabel=""
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>

          {showBreakdown && (
            <div className="mt-2 space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Current ({formatUsage(currentUsage)}):</span>
                <span>{formatCurrency(calculations.currentCost)}/month</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Projected ({formatUsage(projectedUsage)}):</span>
                <span>{formatCurrency(calculations.projectedCost)}/month</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Pre-configured estimators for common services
// ===========================================

interface BandwidthCostEstimatorProps {
  currentGB: number;
  projectedGB: number;
  showBreakdown?: boolean;
}

export function BandwidthCostEstimator({
  currentGB,
  projectedGB,
  showBreakdown = false,
}: BandwidthCostEstimatorProps) {
  return (
    <CostEstimator
      basePrice={0.01} // $0.01 per GB
      unit="GB"
      currentUsage={currentGB}
      projectedUsage={projectedGB}
      showBreakdown={showBreakdown}
    />
  );
}

interface StorageCostEstimatorProps {
  currentGB: number;
  projectedGB: number;
  showBreakdown?: boolean;
}

export function StorageCostEstimator({
  currentGB,
  projectedGB,
  showBreakdown = false,
}: StorageCostEstimatorProps) {
  return (
    <CostEstimator
      basePrice={0.005} // $0.005 per GB/month
      unit="GB"
      currentUsage={currentGB}
      projectedUsage={projectedGB}
      showBreakdown={showBreakdown}
    />
  );
}

interface StreamViewsCostEstimatorProps {
  currentViews: number;
  projectedViews: number;
  showBreakdown?: boolean;
}

export function StreamViewsCostEstimator({
  currentViews,
  projectedViews,
  showBreakdown = false,
}: StreamViewsCostEstimatorProps) {
  return (
    <CostEstimator
      basePrice={0.0005} // $0.0005 per view
      unit="views"
      currentUsage={currentViews}
      projectedUsage={projectedViews}
      decimals={2}
      showBreakdown={showBreakdown}
    />
  );
}

export default CostEstimator;
