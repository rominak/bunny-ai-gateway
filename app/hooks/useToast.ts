'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number; // ms, default 3000
  dismissible?: boolean;
}

interface ToastState {
  toasts: Toast[];
}

export interface UseToastReturn {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
  // Convenience methods
  success: (message: string, description?: string) => string;
  error: (message: string, description?: string) => string;
  info: (message: string, description?: string) => string;
  warning: (message: string, description?: string) => string;
  copied: (value?: string) => string; // Special case for copy confirmations
}

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 5;

export function useToast(): UseToastReturn {
  const [state, setState] = useState<ToastState>({ toasts: [] });
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    // Clear the timeout if exists
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }

    setState(prev => ({
      toasts: prev.toasts.filter(t => t.id !== id),
    }));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duration = toast.duration ?? DEFAULT_DURATION;

    setState(prev => {
      // Limit number of toasts
      const existingToasts = prev.toasts.slice(-(MAX_TOASTS - 1));
      return {
        toasts: [...existingToasts, { ...toast, id }],
      };
    });

    // Auto-dismiss after duration
    if (duration > 0) {
      const timeout = setTimeout(() => {
        dismissToast(id);
      }, duration);
      timeoutRefs.current.set(id, timeout);
    }

    return id;
  }, [dismissToast]);

  const dismissAll = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
    setState({ toasts: [] });
  }, []);

  // Convenience methods
  const success = useCallback((message: string, description?: string) => {
    return showToast({ type: 'success', message, description });
  }, [showToast]);

  const error = useCallback((message: string, description?: string) => {
    return showToast({ type: 'error', message, description, duration: 5000 }); // Longer for errors
  }, [showToast]);

  const info = useCallback((message: string, description?: string) => {
    return showToast({ type: 'info', message, description });
  }, [showToast]);

  const warning = useCallback((message: string, description?: string) => {
    return showToast({ type: 'warning', message, description, duration: 4000 });
  }, [showToast]);

  const copied = useCallback((value?: string) => {
    const message = value
      ? `Copied "${value.length > 20 ? value.slice(0, 20) + '...' : value}"`
      : 'Copied to clipboard';
    return showToast({ type: 'success', message, duration: 2000 });
  }, [showToast]);

  return {
    toasts: state.toasts,
    showToast,
    dismissToast,
    dismissAll,
    success,
    error,
    info,
    warning,
    copied,
  };
}

export default useToast;
