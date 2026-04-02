'use client';

import { ReactNode } from 'react';
import FaIcon from '../FaIcon';
import Button, { IconButton } from './Button';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface PageHeaderProps {
  title: string;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  secondaryButtonLabel?: string;
  onSecondaryButtonClick?: () => void;
  secondaryButtonHref?: string;
  secondaryButtonIcon?: string;
  addButtonLabel?: string;
  onAddClick?: () => void;
  addButtonHref?: string;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  secondaryButtonHref,
  secondaryButtonIcon = 'fas fa-bolt',
  addButtonLabel,
  onAddClick,
  addButtonHref,
  children,
}: PageHeaderProps) {
  const SecondaryButton = () => {
    if (!secondaryButtonLabel) return null;

    return (
      <Button
        variant="secondary"
        size="sm"
        icon={secondaryButtonIcon}
        href={secondaryButtonHref}
        onClick={onSecondaryButtonClick}
      >
        {secondaryButtonLabel}
      </Button>
    );
  };

  const AddButton = () => {
    if (!addButtonLabel) return null;

    return (
      <Button
        variant="cta"
        size="sm"
        icon="fas fa-plus"
        href={addButtonHref}
        onClick={onAddClick}
      >
        {addButtonLabel}
      </Button>
    );
  };

  return (
    <div className="bg-white rounded-[12px] card-shadow mb-[20px]">
      {/* Top row: Title + Actions */}
      <div className="px-[20px] py-[16px] flex items-center justify-between">
        <h1 className="text-[20px] font-semibold text-[#243342]">{title}</h1>

        <div className="flex items-center gap-[12px]">
          {/* Search */}
          {onSearchChange && (
            <div className="relative">
              <FaIcon
                icon="fas fa-search"
                className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[12px] text-[#9ba7b2]"
                ariaLabel="Search"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-[200px] h-[32px] pl-[32px] pr-[12px] rounded-[6px] border border-[#e6e9ec] text-[13px] placeholder-[#9ba7b2] focus:outline-none focus:border-[#1870c6]"
              />
            </div>
          )}

          {/* Secondary Action Button */}
          <SecondaryButton />

          {/* Add Button */}
          <AddButton />

          {/* Menu button */}
          <IconButton
            icon="fas fa-ellipsis-vertical"
            variant="outline"
            size="md"
            aria-label="More options"
          />
        </div>
      </div>

      {/* Bottom row: Tabs */}
      {(tabs || children) && (
        <div className="px-[20px] pb-[16px] flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            {/* Tabs */}
            {tabs && tabs.length > 0 && (
              <div className="flex items-center gap-[4px]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={`px-[12px] py-[6px] rounded-[6px] text-[13px] font-medium flex items-center gap-[6px] transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#243342] text-white'
                        : 'text-[#687a8b] hover:bg-[#f3f4f5] border border-[#e6e9ec]'
                    }`}
                  >
                    {tab.icon && (
                      <FaIcon icon={tab.icon} className="text-[10px]" ariaLabel={tab.label} />
                    )}
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`ml-[2px] px-[6px] py-[1px] rounded-full text-[10px] font-medium ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-[#f3f4f5] text-[#687a8b]'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Optional children (e.g., view toggle, sort dropdown) */}
          {children && (
            <div className="flex items-center gap-[12px]">
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
