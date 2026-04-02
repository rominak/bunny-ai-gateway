'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Notification,
  NotificationCategory,
  NotificationState,
} from '../types/userProfile';
import { ALL_MOCK_NOTIFICATIONS, MOCK_NOTIFICATION_STATE } from '../data/mockNotifications';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  unreadByCategory: Record<NotificationCategory, number>;

  // Filtering
  getByCategory: (category: NotificationCategory) => Notification[];
  getUnread: () => Notification[];

  // Actions
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markCategoryAsRead: (category: NotificationCategory) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;

  // State
  activeCategory: NotificationCategory | 'all';
  setActiveCategory: (category: NotificationCategory | 'all') => void;
}

export function useNotifications(): UseNotificationsReturn {
  // Initialize with mock data
  const [state, setState] = useState<NotificationState>(MOCK_NOTIFICATION_STATE);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'all'>('all');

  // Computed values
  const unreadCount = useMemo(() => {
    return state.notifications.filter(n => !n.read).length;
  }, [state.notifications]);

  const unreadByCategory = useMemo(() => {
    return {
      account: state.notifications.filter(n => n.category === 'account' && !n.read).length,
      incidents: state.notifications.filter(n => n.category === 'incidents' && !n.read).length,
      'product-updates': state.notifications.filter(n => n.category === 'product-updates' && !n.read).length,
    };
  }, [state.notifications]);

  // Filtering methods
  const getByCategory = useCallback((category: NotificationCategory) => {
    return state.notifications.filter(n => n.category === category);
  }, [state.notifications]);

  const getUnread = useCallback(() => {
    return state.notifications.filter(n => !n.read);
  }, [state.notifications]);

  // Action methods
  const markAsRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: prev.notifications.filter(n => !n.read && n.id !== id).length,
    }));
  }, []);

  const markAllAsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
      lastChecked: new Date().toISOString(),
    }));
  }, []);

  const markCategoryAsRead = useCallback((category: NotificationCategory) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.category === category ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const dismiss = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  }, []);

  const dismissAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: [],
      unreadCount: 0,
    }));
  }, []);

  return {
    notifications: state.notifications,
    unreadCount,
    unreadByCategory,
    getByCategory,
    getUnread,
    markAsRead,
    markAllAsRead,
    markCategoryAsRead,
    dismiss,
    dismissAll,
    activeCategory,
    setActiveCategory,
  };
}

export default useNotifications;
