'use client';

import FaIcon from '../FaIcon';

type BadgeColor = 'neutral' | 'strong' | 'highlight' | 'success' | 'warning' | 'error' | 'white';
type BadgeSize = 'sm' | 'md';
type BadgeType = 'border' | 'solid';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  type?: BadgeType;
  icon?: string;
  onDismiss?: () => void;
  className?: string;
}

const styles: Record<BadgeColor, { border: string; solid: string }> = {
  neutral: {
    border: 'bg-[#f3f4f5] border border-[#cdd3d8] text-[#364e65]',
    solid:  'bg-[#cdd3d8] text-[#364e65]',
  },
  strong: {
    border: 'bg-white border border-[#243342] text-[#262830]',
    solid:  'bg-[#243342] border border-[#243342] text-white',
  },
  highlight: {
    border: 'bg-[#eef4fe] border border-[#1870c6] text-[#1870c6]',
    solid:  'bg-[#1870c6] text-white',
  },
  success: {
    border: 'bg-[#f2faf5] border border-[#c8ead6] text-[#2fc584]',
    solid:  'bg-[#2fc584] text-white',
  },
  warning: {
    border: 'bg-[#fdf8ef] border border-[#fce9c8] text-[#e58810]',
    solid:  'bg-[#ffaf48] text-white',
  },
  error: {
    border: 'bg-[#fff5f3] border border-[#f6bfb1] text-[#de3e25]',
    solid:  'bg-[#de3e25] text-white',
  },
  white: {
    border: 'bg-white border border-[#cdd3d8] text-[#364e65]',
    solid:  'bg-white border border-[#cdd3d8] text-[#364e65]',
  },
};

const iconColors: Record<BadgeColor, Record<BadgeType, string>> = {
  neutral:   { border: 'text-[#364e65]', solid: 'text-[#364e65]' },
  strong:    { border: 'text-[#262830]', solid: 'text-white' },
  highlight: { border: 'text-[#1870c6]', solid: 'text-white' },
  success:   { border: 'text-[#2fc584]', solid: 'text-white' },
  warning:   { border: 'text-[#e58810]', solid: 'text-white' },
  error:     { border: 'text-[#de3e25]', solid: 'text-white' },
  white:     { border: 'text-[#364e65]', solid: 'text-[#364e65]' },
};

export default function Badge({
  children,
  color = 'neutral',
  size = 'sm',
  type = 'border',
  icon,
  onDismiss,
  className = '',
}: BadgeProps) {
  const heightClass = size === 'sm' ? 'h-[20px]' : 'h-[24px]';
  const textClass = size === 'sm' ? 'text-[12px] leading-[12px]' : 'text-[14px] leading-[18px]';
  const colorClass = styles[color][type];
  const iconColorClass = iconColors[color][type];

  return (
    <span
      className={`inline-flex items-center gap-[2px] px-[5px] rounded-[4px] font-semibold shadow-[0px_1px_2px_0px_rgba(12,12,12,0.05)] whitespace-nowrap ${heightClass} ${textClass} ${colorClass} ${className}`}
    >
      {children}
      {icon && (
        <FaIcon icon={icon} className={`text-[11px] ${iconColorClass}`} ariaLabel="" />
      )}
      {onDismiss && (
        <button onClick={onDismiss} className={`ml-[1px] ${iconColorClass} hover:opacity-70`}>
          <FaIcon icon="fas fa-xmark" className="text-[10px]" ariaLabel="Remove" />
        </button>
      )}
    </span>
  );
}
