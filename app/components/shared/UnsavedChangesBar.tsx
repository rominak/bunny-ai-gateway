'use client';

import { useEffect, useState } from 'react';
import FaIcon from '../FaIcon';

interface UnsavedChangesBarProps {
  /** Whether there are unsaved changes */
  hasChanges: boolean;
  /** Callback when save is clicked */
  onSave: () => void | Promise<void>;
  /** Callback when discard is clicked */
  onDiscard: () => void;
  /** Whether save is in progress */
  isSaving?: boolean;
  /** Optional description of what changed */
  changeDescription?: string;
  /** Position of the bar */
  position?: 'top' | 'bottom';
}

/**
 * UnsavedChangesBar - Sticky bar showing when form has unsaved changes
 *
 * Key features:
 * - Appears when changes are detected
 * - Save and Discard buttons
 * - Shows what changed (optional)
 * - Loading state during save
 * - Keyboard shortcut hint (Cmd/Ctrl+S)
 */
export function UnsavedChangesBar({
  hasChanges,
  onSave,
  onDiscard,
  isSaving = false,
  changeDescription,
  position = 'bottom',
}: UnsavedChangesBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animate in/out
  useEffect(() => {
    if (hasChanges) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [hasChanges]);

  // Keyboard shortcut for save (Cmd/Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && hasChanges && !isSaving) {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges, isSaving, onSave]);

  if (!isVisible) return null;

  const positionClasses = position === 'top'
    ? 'top-0 border-b'
    : 'bottom-0 border-t';

  return (
    <div
      className={`
        fixed left-0 right-0 z-50 ${positionClasses}
        bg-white border-gray-200 shadow-lg
        transform transition-transform duration-200
        ${hasChanges ? 'translate-y-0' : position === 'top' ? '-translate-y-full' : 'translate-y-full'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Message */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <FaIcon
                icon="fa-pen-to-square"
                className="text-sm text-[#f59e0b]"
                ariaLabel=""
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">
                You have unsaved changes
              </p>
              {changeDescription && (
                <p className="text-xs text-gray-500 truncate">
                  {changeDescription}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onDiscard}
              disabled={isSaving}
              className="
                px-3 py-1.5 text-sm font-medium text-gray-700
                hover:bg-gray-100 rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="
                px-4 py-1.5 text-sm font-medium text-white
                bg-blue-600 hover:bg-blue-700 rounded-lg
                transition-colors flex items-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSaving ? (
                <>
                  <FaIcon
                    icon="fa-spinner"
                    className="text-xs animate-spin"
                    ariaLabel=""
                  />
                  Saving...
                </>
              ) : (
                <>
                  Save changes
                  <kbd className="hidden sm:inline-block text-xs text-blue-200 bg-blue-700 px-1.5 py-0.5 rounded">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+S
                  </kbd>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Hook for tracking form changes
// ===========================================

interface UseFormChangesOptions<T extends object> {
  initialValues: T;
  values: T;
}

export function useFormChanges<T extends object>({
  initialValues,
  values,
}: UseFormChangesOptions<T>) {
  const hasChanges = JSON.stringify(initialValues) !== JSON.stringify(values);

  const changedFields = Object.keys(values).filter(
    (key) =>
      JSON.stringify(initialValues[key as keyof T]) !==
      JSON.stringify(values[key as keyof T])
  );

  const changeDescription =
    changedFields.length === 1
      ? `Changed: ${changedFields[0]}`
      : changedFields.length > 1
      ? `Changed ${changedFields.length} fields`
      : undefined;

  return {
    hasChanges,
    changedFields,
    changeDescription,
  };
}

export default UnsavedChangesBar;
