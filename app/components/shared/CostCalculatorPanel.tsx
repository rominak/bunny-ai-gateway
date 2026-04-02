'use client';

import FaIcon from '../FaIcon';

interface CostCalculatorPanelProps {
  title?: string;
  children: React.ReactNode;
}

export default function CostCalculatorPanel({
  title = 'Estimated Cost',
  children,
}: CostCalculatorPanelProps) {
  return (
    <div className="bg-[#eef4fe] rounded-[8px] p-[16px] flex gap-[12px] mb-[20px]">
      <div className="flex-shrink-0">
        <FaIcon
          icon="fas fa-calculator"
          className="text-[20px] text-[#1870c6]"
          ariaLabel="Calculator"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-[14px] font-semibold text-[#243342] mb-[8px]">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
