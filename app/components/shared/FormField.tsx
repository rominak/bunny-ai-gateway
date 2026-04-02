'use client';

import { useState, useCallback, ReactNode } from 'react';
import FaIcon from '../FaIcon';

interface FormFieldProps {
  /** Field label */
  label: string;
  /** Field name for form submission */
  name: string;
  /** Current field value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Field type */
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'textarea';
  /** Placeholder text */
  placeholder?: string;
  /** Helper text shown below the field */
  hint?: string;
  /** Error message (when validation fails) */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Custom validation function - returns error message or undefined */
  validate?: (value: string) => string | undefined;
  /** Optional left addon (icon or text) */
  leftAddon?: ReactNode;
  /** Optional right addon (icon or text) */
  rightAddon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Number of rows for textarea */
  rows?: number;
  /** Maximum character count */
  maxLength?: number;
  /** Whether to show character count */
  showCharCount?: boolean;
}

/**
 * FormField - Consistent form field with validation
 *
 * Key features:
 * - Validates on blur only (not on every keystroke)
 * - Shows hints proactively
 * - Clear error styling with auto-focus capability
 * - Accessible with proper ARIA attributes
 */
export function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  hint,
  error: externalError,
  required = false,
  disabled = false,
  validate,
  leftAddon,
  rightAddon,
  className = '',
  rows = 3,
  maxLength,
  showCharCount = false,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | undefined>();

  // Use external error if provided, otherwise use internal validation error
  const error = externalError || (touched ? internalError : undefined);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      setInternalError(validate(value));
    }
    if (required && !value.trim()) {
      setInternalError('This field is required');
    }
  }, [validate, value, required]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      // Clear error while typing (will re-validate on blur)
      if (internalError) {
        setInternalError(undefined);
      }
    },
    [onChange, internalError]
  );

  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const baseInputClasses = `
    w-full px-3 py-2 text-sm text-gray-900
    border rounded-lg transition-colors
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  const inputClasses = error
    ? `${baseInputClasses} border-red-300 focus:border-red-500 focus:ring-red-200`
    : `${baseInputClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-200`;

  const charCount = value.length;
  const isOverLimit = maxLength ? charCount > maxLength : false;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        {leftAddon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftAddon}
          </div>
        )}

        {type === 'textarea' ? (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={`${inputClasses} resize-none`}
            aria-invalid={!!error}
            aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`}
          />
        ) : (
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={`${inputClasses} ${leftAddon ? 'pl-10' : ''} ${rightAddon ? 'pr-10' : ''}`}
            aria-invalid={!!error}
            aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`}
          />
        )}

        {rightAddon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightAddon}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          id={errorId}
          className="flex items-center gap-1.5 text-sm text-red-600"
          role="alert"
        >
          <FaIcon icon="fa-circle-exclamation" className="text-xs" ariaLabel="" />
          {error}
        </div>
      )}

      {/* Hint text */}
      {hint && !error && (
        <p id={hintId} className="text-sm text-gray-500">
          {hint}
        </p>
      )}

      {/* Character count */}
      {showCharCount && (
        <p
          className={`text-xs text-right ${
            isOverLimit ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          {charCount}
          {maxLength && ` / ${maxLength}`}
        </p>
      )}
    </div>
  );
}

// ===========================================
// Validation Helpers
// ===========================================

export const validators = {
  required: (message = 'This field is required') => (value: string) =>
    value.trim() ? undefined : message,

  email: (message = 'Please enter a valid email') => (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : message,

  url: (message = 'Please enter a valid URL') => (value: string) => {
    try {
      new URL(value);
      return undefined;
    } catch {
      return message;
    }
  },

  minLength: (min: number, message?: string) => (value: string) =>
    value.length >= min
      ? undefined
      : message || `Must be at least ${min} characters`,

  maxLength: (max: number, message?: string) => (value: string) =>
    value.length <= max
      ? undefined
      : message || `Must be at most ${max} characters`,

  pattern: (regex: RegExp, message: string) => (value: string) =>
    regex.test(value) ? undefined : message,

  compose:
    (...validators: ((value: string) => string | undefined)[]) =>
    (value: string) => {
      for (const validate of validators) {
        const error = validate(value);
        if (error) return error;
      }
      return undefined;
    },
};

export default FormField;
