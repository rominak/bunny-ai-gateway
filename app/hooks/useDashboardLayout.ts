'use client';

import { useState, useCallback, useEffect } from 'react';
import { DashboardType, WidgetPosition, getDefaultLayout } from '../types/userProfile';

interface UseDashboardLayoutOptions {
  dashboardType: DashboardType;
}

const STORAGE_KEY_PREFIX = 'bunny-dashboard-layout-';

export function useDashboardLayout({ dashboardType }: UseDashboardLayoutOptions) {
  const [layout, setLayout] = useState<WidgetPosition[]>(() => {
    // Will be populated in useEffect to avoid SSR issues
    return getDefaultLayout(dashboardType);
  });

  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Load layout from localStorage on mount
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${dashboardType}`;
    const versionKey = `${STORAGE_KEY_PREFIX}${dashboardType}-version`;
    const saved = localStorage.getItem(storageKey);
    const defaultLayout = getDefaultLayout(dashboardType);

    // Create a version hash from the default layout order
    const defaultVersion = defaultLayout.map(w => w.id).join(',');
    const savedVersion = localStorage.getItem(versionKey);

    if (saved && savedVersion === defaultVersion) {
      try {
        const parsed = JSON.parse(saved) as WidgetPosition[];

        // Check if the cached layout has the same widget IDs
        const defaultIds = defaultLayout.map(w => w.id).sort().join(',');
        const cachedIds = parsed.map(w => w.id).sort().join(',');

        if (defaultIds === cachedIds) {
          setLayout(parsed);
          return;
        }
      } catch {
        // Fall through to default layout
      }
    }

    // Use default layout and save version
    setLayout(defaultLayout);
    localStorage.setItem(storageKey, JSON.stringify(defaultLayout));
    localStorage.setItem(versionKey, defaultVersion);
  }, [dashboardType]);

  // Save layout to localStorage whenever it changes
  const saveLayout = useCallback((newLayout: WidgetPosition[]) => {
    const storageKey = `${STORAGE_KEY_PREFIX}${dashboardType}`;
    const versionKey = `${STORAGE_KEY_PREFIX}${dashboardType}-version`;
    const defaultLayout = getDefaultLayout(dashboardType);
    const defaultVersion = defaultLayout.map(w => w.id).join(',');

    localStorage.setItem(storageKey, JSON.stringify(newLayout));
    localStorage.setItem(versionKey, defaultVersion);
  }, [dashboardType]);

  // Handle drag start
  const handleDragStart = useCallback((widgetId: string) => {
    setDraggedWidget(widgetId);
  }, []);

  // Handle drag over (for visual feedback)
  const handleDragOver = useCallback((widgetId: string) => {
    if (draggedWidget && widgetId !== draggedWidget) {
      setDropTarget(widgetId);
    }
  }, [draggedWidget]);

  // Handle drag leave
  const handleDragLeave = useCallback(() => {
    setDropTarget(null);
  }, []);

  // Handle drop - swap positions
  const handleDrop = useCallback((targetWidgetId: string) => {
    if (!draggedWidget || draggedWidget === targetWidgetId) {
      setDraggedWidget(null);
      setDropTarget(null);
      return;
    }

    setLayout(currentLayout => {
      const newLayout = [...currentLayout];
      const dragIndex = newLayout.findIndex(w => w.id === draggedWidget);
      const dropIndex = newLayout.findIndex(w => w.id === targetWidgetId);

      if (dragIndex === -1 || dropIndex === -1) {
        return currentLayout;
      }

      // Swap the order values
      const dragOrder = newLayout[dragIndex].order;
      newLayout[dragIndex].order = newLayout[dropIndex].order;
      newLayout[dropIndex].order = dragOrder;

      // Sort by order
      newLayout.sort((a, b) => a.order - b.order);

      // Save to localStorage
      saveLayout(newLayout);

      return newLayout;
    });

    setDraggedWidget(null);
    setDropTarget(null);
  }, [draggedWidget, saveLayout]);

  // Handle drag end (cleanup)
  const handleDragEnd = useCallback(() => {
    setDraggedWidget(null);
    setDropTarget(null);
  }, []);

  // Reset layout to default
  const resetLayout = useCallback(() => {
    const defaultLayout = getDefaultLayout(dashboardType);
    setLayout(defaultLayout);
    saveLayout(defaultLayout);
  }, [dashboardType, saveLayout]);

  // Get sorted layout
  const sortedLayout = [...layout].sort((a, b) => a.order - b.order);

  return {
    layout: sortedLayout,
    draggedWidget,
    dropTarget,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    resetLayout,
  };
}

export default useDashboardLayout;
