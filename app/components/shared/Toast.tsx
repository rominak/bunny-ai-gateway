'use client';

import { Toast as ToastType, ToastType as ToastVariant } from '../../hooks/useToast';
import { useEffect, useState } from 'react';
import FaIcon from '../FaIcon';

// ===========================================
// Single Toast Component
// ===========================================

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const TOAST_CONFIG: Record<ToastVariant, {
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  icon: string;
}> = {
  success: {
    bgColor: 'bg-white',
    borderColor: 'border-emerald-200',
    textColor: 'text-gray-900',
    iconColor: 'text-emerald-500',
    icon: 'check-circle',
  },
  error: {
    bgColor: 'bg-white',
    borderColor: 'border-red-200',
    textColor: 'text-gray-900',
    iconColor: 'text-red-500',
    icon: 'circle-exclamation',
  },
  warning: {
    bgColor: 'bg-white',
    borderColor: 'border-amber-200',
    textColor: 'text-gray-900',
    iconColor: 'text-[#f59e0b]',
    icon: 'triangle-exclamation',
  },
  info: {
    bgColor: 'bg-white',
    borderColor: 'border-blue-200',
    textColor: 'text-gray-900',
    iconColor: 'text-blue-500',
    icon: 'circle-info',
  },
};

export function ToastItem({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const config = TOAST_CONFIG[toast.type];

  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border
        ${config.bgColor} ${config.borderColor}
        transition-all duration-200 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{ maxWidth: '380px', minWidth: '280px' }}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
        <FaIcon icon={config.icon} className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${config.textColor}`}>
          {toast.message}
        </p>
        {toast.description && (
          <p className="mt-1 text-sm text-gray-500">
            {toast.description}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      {toast.dismissible !== false && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors"
          aria-label="Dismiss notification"
        >
          <FaIcon icon="xmark" className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}

// ===========================================
// Toast Container Component
// ===========================================

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const POSITION_CLASSES: Record<NonNullable<ToastContainerProps['position']>, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastContainer({
  toasts,
  onDismiss,
  position = 'top-right',
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed z-[9999] flex flex-col gap-2 ${POSITION_CLASSES[position]}`}
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

// ===========================================
// Toast Context Provider (optional, for global access)
// ===========================================

import { createContext, useContext, ReactNode } from 'react';
import { useToast, UseToastReturn } from '../../hooks/useToast';

const ToastContext = createContext<UseToastReturn | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer
        toasts={toast.toasts}
        onDismiss={toast.dismissToast}
      />
    </ToastContext.Provider>
  );
}

export function useToastContext(): UseToastReturn {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}

export default ToastContainer;
