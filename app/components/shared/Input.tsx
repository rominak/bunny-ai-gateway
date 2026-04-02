'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import FaIcon from '../FaIcon';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  required?: boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      success,
      size = 'md',
      leftIcon,
      rightIcon,
      onRightIconClick,
      required,
      fullWidth = true,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const sizeStyles = {
      sm: 'h-[36px] text-[13px] px-[12px]',
      md: 'h-[44px] text-[14px] px-[14px]',
      lg: 'h-[52px] text-[15px] px-[16px]',
    };

    const getInputStyles = () => {
      const base = `
        w-full rounded-[8px] border transition-all
        placeholder-[#9ba7b2] text-[#243342]
        focus:outline-none
        ${sizeStyles[size]}
        ${leftIcon ? 'pl-[40px]' : ''}
        ${rightIcon ? 'pr-[40px]' : ''}
      `;

      if (disabled) {
        return `${base} bg-[#f3f4f5] border-[#e6e9ec] text-[#9ba7b2] cursor-not-allowed`;
      }

      if (error) {
        return `${base} border-[#dc2626] bg-white focus:border-[#dc2626] focus:shadow-[0_0_0_2px_rgba(220,38,38,0.15)]`;
      }

      if (success) {
        return `${base} border-[#16a34a] bg-white focus:border-[#16a34a] focus:shadow-[0_0_0_2px_rgba(22,163,74,0.15)]`;
      }

      return `${base} border-[#e6e9ec] bg-white hover:border-[#c4cdd5] focus:border-[#1870c6] focus:shadow-[0_0_0_2px_rgba(24,112,198,0.15)]`;
    };

    const getIconColor = () => {
      if (disabled) return 'text-[#c4cdd5]';
      if (error) return 'text-[#dc2626]';
      if (success) return 'text-[#16a34a]';
      if (isFocused) return 'text-[#1870c6]';
      return 'text-[#9ba7b2]';
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {/* Label */}
        {label && (
          <label className="text-[14px] font-medium text-[#243342] mb-[6px] block">
            {label}
            {required && <span className="text-[#dc2626] ml-[2px]">*</span>}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className={`absolute left-[14px] top-1/2 -translate-y-1/2 ${getIconColor()} transition-colors`}>
              <FaIcon icon={leftIcon} className="text-[14px]" ariaLabel="" />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={getInputStyles()}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              disabled={disabled || !onRightIconClick}
              className={`absolute right-[14px] top-1/2 -translate-y-1/2 ${getIconColor()} transition-colors ${
                onRightIconClick && !disabled ? 'cursor-pointer hover:text-[#243342]' : ''
              }`}
            >
              <FaIcon icon={rightIcon} className="text-[14px]" ariaLabel="" />
            </button>
          )}
        </div>

        {/* Helper text */}
        {(hint || error || success) && (
          <div className="mt-[6px] flex items-start gap-[6px]">
            {error && (
              <>
                <FaIcon icon="fas fa-circle-exclamation" className="text-[11px] text-[#dc2626] mt-[2px]" ariaLabel="Error" />
                <span className="text-[12px] text-[#dc2626]">{error}</span>
              </>
            )}
            {success && !error && (
              <>
                <FaIcon icon="fas fa-circle-check" className="text-[11px] text-[#16a34a] mt-[2px]" ariaLabel="Success" />
                <span className="text-[12px] text-[#16a34a]">{success}</span>
              </>
            )}
            {hint && !error && !success && (
              <>
                <FaIcon icon="fas fa-circle-info" className="text-[11px] text-[#9ba7b2] mt-[2px]" ariaLabel="Hint" />
                <span className="text-[12px] text-[#9ba7b2]">{hint}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
