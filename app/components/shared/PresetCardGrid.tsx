'use client';

import FaIcon from '../FaIcon';

export interface Preset {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
  badge?: string;
  icon?: string;
  details?: string[];
}

interface PresetCardGridProps {
  presets: Preset[];
  selectedId: string;
  onSelect: (id: string) => void;
  columns?: 2 | 3 | 4;
}

export default function PresetCardGrid({
  presets,
  selectedId,
  onSelect,
  columns = 2,
}: PresetCardGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-[12px]`}>
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset.id)}
          className={`p-[16px] rounded-[10px] border-2 text-left transition-all ${
            selectedId === preset.id
              ? 'border-[#1870c6] bg-[#eef4fe]'
              : 'border-[#e6e9ec] hover:border-[#c4cdd5]'
          }`}
        >
          <div className="flex items-center gap-[8px] mb-[6px]">
            {preset.icon && (
              <FaIcon
                icon={preset.icon}
                className="text-[14px] text-[#1870c6]"
                ariaLabel={preset.name}
              />
            )}
            <span className="text-[14px] font-semibold text-[#243342]">
              {preset.name}
            </span>
            {preset.recommended && (
              <span className="px-[6px] py-[2px] rounded-[4px] bg-[#16a34a] text-[10px] font-medium text-white">
                Recommended
              </span>
            )}
            {preset.badge && !preset.recommended && (
              <span className="px-[6px] py-[2px] rounded-[4px] bg-[#f59e0b] text-[10px] font-medium text-white">
                {preset.badge}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#687a8b] mb-[8px]">
            {preset.description}
          </p>
          {preset.details && preset.details.length > 0 && (
            <div className="flex flex-wrap gap-[4px]">
              {preset.details.map((detail, index) => (
                <span
                  key={index}
                  className="px-[6px] py-[2px] rounded-[4px] bg-[#f3f4f5] text-[10px] font-medium text-[#687a8b]"
                >
                  {detail}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
