'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import FaIcon from '../FaIcon';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`w-full h-[44px] px-[12px] pr-[36px] rounded-[8px] border text-[14px] appearance-none bg-white focus:outline-none transition-colors ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-[#e6e9ec] focus:border-[#1870c6]'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
        <FaIcon
          icon="fas fa-chevron-down"
          className="text-[10px] text-[#687a8b]"
          ariaLabel="Dropdown"
        />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
