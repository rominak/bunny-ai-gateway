'use client';

import FaIcon from '../FaIcon';

interface InfoCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning';
}

export default function InfoCard({
  title,
  icon,
  children,
  variant = 'info',
}: InfoCardProps) {
  const variantStyles = {
    info: 'bg-[#eef4fe] border-[#1870c6]',
    success: 'bg-green-50 border-[#16a34a]',
    warning: 'bg-amber-50 border-[#f59e0b]',
  };

  const iconColors = {
    info: 'text-[#1870c6]',
    success: 'text-[#16a34a]',
    warning: 'text-[#f59e0b]',
  };

  return (
    <div
      className={`${variantStyles[variant]} rounded-[8px] border-2 p-[16px] mb-[20px]`}
    >
      <div className="flex gap-[12px]">
        <div className="flex-shrink-0">
          <FaIcon
            icon={icon}
            className={`text-[20px] ${iconColors[variant]}`}
            ariaLabel={title}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] font-semibold text-[#243342] mb-[8px]">
            {title}
          </h3>
          {children}
        </div>
      </div>
    </div>
  );
}
