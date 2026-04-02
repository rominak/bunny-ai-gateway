import FaIcon from '@/app/components/FaIcon';
import type { Region } from '@/app/types/containers';

interface RegionMultiSelectProps {
  regions: Region[];
  selectedRegions: string[];
  onSelectionChange: (regions: string[]) => void;
  primaryRegion?: string;
  onPrimaryChange?: (region: string) => void;
  requirePrimary?: boolean;
}

export default function RegionMultiSelect({
  regions,
  selectedRegions,
  onSelectionChange,
  primaryRegion,
  onPrimaryChange,
  requirePrimary = true,
}: RegionMultiSelectProps) {
  const handleToggleRegion = (regionCode: string) => {
    if (selectedRegions.includes(regionCode)) {
      // Deselecting - remove from selected
      const newSelection = selectedRegions.filter(r => r !== regionCode);
      onSelectionChange(newSelection);

      // If this was the primary region, clear primary or set to first available
      if (primaryRegion === regionCode && onPrimaryChange) {
        onPrimaryChange(newSelection[0] || '');
      }
    } else {
      // Selecting - add to selected
      const newSelection = [...selectedRegions, regionCode];
      onSelectionChange(newSelection);

      // If no primary set yet and we require one, set this as primary
      if (!primaryRegion && requirePrimary && onPrimaryChange) {
        onPrimaryChange(regionCode);
      }
    }
  };

  const handleSetPrimary = (regionCode: string) => {
    if (onPrimaryChange && selectedRegions.includes(regionCode)) {
      onPrimaryChange(regionCode);
    }
  };

  return (
    <div className="space-y-[12px]">
      <div>
        <label className="block text-[13px] font-medium text-[#243342] mb-[4px]">
          Select Regions
        </label>
        <p className="text-[12px] text-[#687a8b]">
          Choose at least 2 regions for multi-region deployment
        </p>
      </div>

      {/* Regions grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[12px]">
        {regions.map((region) => {
          const isSelected = selectedRegions.includes(region.code);
          const isPrimary = primaryRegion === region.code;

          return (
            <div
              key={region.code}
              className={`relative bg-white border rounded-[12px] p-[16px] transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#1870c6] shadow-[0px_0px_0px_3px_rgba(24,112,198,0.1)]'
                  : 'border-[#e6e9ec] hover:border-[#1870c6]/50'
              }`}
              onClick={() => handleToggleRegion(region.code)}
            >
              {/* Checkbox */}
              <div className="absolute top-[12px] right-[12px]">
                <div
                  className={`w-[20px] h-[20px] rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-[#1870c6] bg-[#1870c6]'
                      : 'border-[#e6e9ec] bg-white'
                  }`}
                >
                  {isSelected && (
                    <FaIcon icon="fas fa-check" className="text-white text-[10px]" />
                  )}
                </div>
              </div>

              {/* Region info */}
              <div className="pr-[28px]">
                <div className="flex items-center gap-[8px] mb-[8px]">
                  <span className="text-[20px]">{region.flag}</span>
                  <h4 className="text-[14px] font-semibold text-[#243342]">
                    {region.name}
                  </h4>
                </div>

                <div className="flex items-center gap-[8px]">
                  <FaIcon icon="fas fa-signal" className="text-[#9ba7b2] text-[10px]" />
                  <span className="text-[12px] text-[#687a8b]">
                    {region.latency}
                  </span>
                </div>

                {/* Primary badge */}
                {isPrimary && (
                  <div className="mt-[8px]">
                    <span className="px-[6px] py-[2px] bg-[#1870c6] text-white rounded-[4px] text-[10px] font-semibold">
                      Primary
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary region selector */}
      {requirePrimary && selectedRegions.length > 0 && onPrimaryChange && (
        <div className="bg-[#eef4fe] rounded-[12px] p-[16px]">
          <label className="block text-[13px] font-medium text-[#243342] mb-[12px]">
            Primary Region
          </label>
          <p className="text-[12px] text-[#687a8b] mb-[12px]">
            The primary region handles initial requests and serves as the main deployment location
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[8px]">
            {selectedRegions.map((regionCode) => {
              const region = regions.find(r => r.code === regionCode);
              if (!region) return null;

              const isPrimary = primaryRegion === regionCode;

              return (
                <button
                  key={regionCode}
                  onClick={() => handleSetPrimary(regionCode)}
                  className={`flex items-center gap-[8px] p-[12px] rounded-[8px] transition-colors ${
                    isPrimary
                      ? 'bg-[#1870c6] text-white'
                      : 'bg-white text-[#243342] hover:bg-[#1870c6]/10'
                  }`}
                >
                  <div
                    className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center ${
                      isPrimary
                        ? 'border-white'
                        : 'border-[#e6e9ec]'
                    }`}
                  >
                    {isPrimary && (
                      <div className="w-[8px] h-[8px] rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-[14px]">{region.flag}</span>
                  <span className="text-[13px] font-medium">{region.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Validation message */}
      {selectedRegions.length === 1 && (
        <p className="text-[12px] text-[#f59e0b] flex items-center gap-[6px]">
          <FaIcon icon="fas fa-exclamation-triangle" />
          Select at least one more region for multi-region deployment
        </p>
      )}

      {selectedRegions.length === 0 && (
        <p className="text-[12px] text-[#dc2626] flex items-center gap-[6px]">
          <FaIcon icon="fas fa-exclamation-circle" />
          Please select at least 2 regions
        </p>
      )}
    </div>
  );
}
