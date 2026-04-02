'use client';

import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';
import FaIcon from '../FaIcon';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'sidebar' | 'cta';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: 'left' | 'right';
  href?: string;
  fullWidth?: boolean;
  children?: ReactNode;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#243342] hover:bg-[#1a2530] text-white',
  secondary: 'bg-[#183D6D] hover:bg-[#122d52] text-white',
  outline: 'bg-white border border-[#e6e9ec] text-[#243342] hover:bg-[#f8fafc]',
  ghost: 'bg-transparent text-[#687a8b] hover:bg-[#f3f4f5] hover:text-[#243342]',
  danger: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white',
  sidebar: 'bg-white hover:bg-[#f3f4f5] text-[#243342] font-semibold',
  cta: 'bg-gradient-to-br from-[#FFAF48] to-[#FF7854] hover:opacity-90 text-white shadow-[0_1px_2px_0_rgba(12,12,12,0.05)]',
};

const sizeStyles: Record<ButtonSize, { button: string; icon: string }> = {
  sm: { button: 'h-[32px] px-[12px] text-[13px] gap-[6px]', icon: 'text-[10px]' },
  md: { button: 'h-[36px] px-[14px] text-[13px] gap-[8px]', icon: 'text-[12px]' },
  lg: { button: 'h-[40px] px-[20px] text-[14px] gap-[8px]', icon: 'text-[12px]' },
};

const disabledStyles = 'bg-[#c4cdd5] text-white cursor-not-allowed hover:bg-[#c4cdd5]';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  href,
  fullWidth = false,
  children,
  disabled,
  loading,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'rounded-[6px] font-medium inline-flex items-center justify-center transition-colors';
  const variantStyle = disabled ? disabledStyles : variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const widthStyle = fullWidth ? 'w-full' : '';

  const combinedClassName = `${baseStyles} ${variantStyle} ${sizeStyle.button} ${widthStyle} ${className}`.trim();

  const iconElement = icon && !loading ? (
    <FaIcon icon={icon} className={sizeStyle.icon} ariaLabel="" />
  ) : null;

  const loadingElement = loading ? (
    <FaIcon icon="fas fa-spinner fa-spin" className={sizeStyle.icon} ariaLabel="Loading" />
  ) : null;

  const content = (
    <>
      {loading ? loadingElement : iconPosition === 'left' && iconElement}
      {children}
      {!loading && iconPosition === 'right' && iconElement}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={combinedClassName}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

// Icon-only button variant
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  variant = 'outline',
  size = 'md',
  href,
  disabled,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'rounded-[6px] inline-flex items-center justify-center transition-colors';
  const variantStyle = disabled ? disabledStyles : variantStyles[variant];

  const sizeMap: Record<ButtonSize, { button: string; icon: string }> = {
    sm: { button: 'w-[28px] h-[28px]', icon: 'text-[12px]' },
    md: { button: 'w-[32px] h-[32px]', icon: 'text-[14px]' },
    lg: { button: 'w-[40px] h-[40px]', icon: 'text-[16px]' },
  };

  const sizeStyle = sizeMap[size];
  const combinedClassName = `${baseStyles} ${variantStyle} ${sizeStyle.button} ${className}`.trim();

  const content = (
    <FaIcon icon={icon} className={sizeStyle.icon} ariaLabel={props['aria-label']} />
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClassName} aria-label={props['aria-label']}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {content}
    </button>
  );
});

IconButton.displayName = 'IconButton';
