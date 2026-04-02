'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import FaIcon from '../FaIcon';

export interface ResourceItem {
  id: string;
  name: string;
  icon?: string;
}

interface ResourceDropdownProps {
  items: ResourceItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  icon: string;
  iconLabel: string;
  viewAllHref: string;
  viewAllLabel?: string;
  renderItem?: (item: ResourceItem, isSelected: boolean) => ReactNode;
}

export default function ResourceDropdown({
  items,
  selectedId,
  onSelect,
  icon,
  iconLabel,
  viewAllHref,
  viewAllLabel = 'View all zones',
  renderItem,
}: ResourceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find(item => item.id === selectedId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-[12px] py-[10px] bg-white hover:bg-[#f8fafc] rounded-[8px] transition-colors shadow-sm"
      >
        <div className="flex items-center gap-[10px]">
          <div className="w-[28px] h-[28px] rounded-[6px] bg-[#eef4fe] flex items-center justify-center">
            <FaIcon icon={icon} className="text-[12px] text-[#1870c6]" ariaLabel={iconLabel} />
          </div>
          <span className="text-[14px] font-medium text-[#1870c6] truncate max-w-[140px]">
            {selectedItem?.name || 'Select...'}
          </span>
        </div>
        <FaIcon
          icon={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}
          className="text-[10px] text-[#687a8b]"
          ariaLabel={isOpen ? 'Close' : 'Open'}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-[4px] bg-white rounded-[8px] shadow-lg border border-[#e6e9ec] z-50 overflow-hidden">
          {/* Items List */}
          <div className="py-[4px] max-h-[240px] overflow-y-auto">
            {items.map((item) => {
              const isSelected = item.id === selectedId;

              if (renderItem) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full text-left px-[12px] py-[8px] transition-colors ${
                      isSelected
                        ? 'bg-[#1870c6] text-white'
                        : 'text-[#243342] hover:bg-[#eef4fe]'
                    }`}
                  >
                    {renderItem(item, isSelected)}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full text-left px-[12px] py-[8px] text-[14px] transition-colors ${
                    isSelected
                      ? 'bg-[#1870c6] text-white'
                      : 'text-[#243342] hover:bg-[#eef4fe]'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* View All Link */}
          <div className="border-t border-[#e6e9ec] px-[12px] py-[10px]">
            <Link
              href={viewAllHref}
              className="text-[14px] text-[#1870c6] font-medium hover:underline"
              onClick={() => setIsOpen(false)}
            >
              {viewAllLabel}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
