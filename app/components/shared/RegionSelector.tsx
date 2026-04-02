'use client';

import { useState } from 'react';
import CountryFlag from './CountryFlag';

export interface Region {
  id: string;
  name: string;
  code: string;
  location: string;
}

interface RegionSelectorProps {
  regions: Region[];
  selectedRegions: string[];
  onSelectionChange: (selected: string[]) => void;
  multiSelect?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
}

export default function RegionSelector({
  regions,
  selectedRegions,
  onSelectionChange,
  multiSelect = false,
  label,
  helperText,
  error,
}: RegionSelectorProps) {
  const handleRegionClick = (regionId: string) => {
    if (multiSelect) {
      if (selectedRegions.includes(regionId)) {
        onSelectionChange(selectedRegions.filter((r) => r !== regionId));
      } else {
        onSelectionChange([...selectedRegions, regionId]);
      }
    } else {
      onSelectionChange([regionId]);
    }
  };

  return (
    <div>
      {label && (
        <label className="text-[14px] font-medium text-[#243342] mb-[6px] block">
          {label}
        </label>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
        {regions.map((region) => {
          const isSelected = selectedRegions.includes(region.id);
          return (
            <div
              key={region.id}
              onClick={() => handleRegionClick(region.id)}
              className={`p-[16px] border-2 rounded-[8px] cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#1870c6] bg-[#eef4fe]'
                  : error
                  ? 'border-red-500 hover:border-red-400'
                  : 'border-[#e6e9ec] hover:border-[#c4cdd5]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <CountryFlag code={region.code} size="lg" />
                  <div>
                    <div className="text-[14px] font-semibold text-[#243342]">
                      {region.name}
                    </div>
                    <div className="text-[12px] text-[#687a8b]">{region.location}</div>
                  </div>
                </div>
                <div
                  className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#1870c6] border-[#1870c6]'
                      : 'border-[#c4cdd5]'
                  }`}
                >
                  {isSelected && (
                    <div className="w-[8px] h-[8px] bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-[12px] text-red-500 mt-[4px]">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-[12px] text-[#9ba7b2] mt-[4px]">{helperText}</p>
      )}
    </div>
  );
}
