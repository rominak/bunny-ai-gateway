'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserState,
  OnboardingStepId,
  Favourite,
  ResourceHealth,
  getDefaultUserState,
} from '../types/userProfile';
import { MOCK_NOTIFICATION_STATE } from '../data/mockNotifications';

const STORAGE_KEY = 'bunny-user-state';

// Demo favourites
const DEMO_FAVOURITES: Favourite[] = [
  {
    id: 'fav-1',
    resourceId: 'pz-1',
    resourceType: 'pull-zone',
    name: 'production-cdn',
    icon: 'globe',
    addedAt: new Date().toISOString(),
  },
  {
    id: 'fav-2',
    resourceId: 'sz-1',
    resourceType: 'storage-zone',
    name: 'media-storage',
    icon: 'database',
    addedAt: new Date().toISOString(),
  },
];

// Demo user state for development
const DEMO_USER_STATE: UserState = {
  id: 'demo-user-1',
  name: 'Romina',
  email: 'romina@example.com',
  emailVerified: false,
  onboarding: {
    currentStep: 'confirm-email',
    steps: [
      { step: 'confirm-email', status: 'in-progress', required: true },
      { step: 'personal-info', status: 'pending', required: false },
      { step: 'credit-card', status: 'pending', required: false },
      { step: 'start-hopping', status: 'pending', required: true },
    ],
  },
  trial: {
    isActive: true,
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    credits: 20.0,
    usedCredits: 0,
    bonusCreditsAvailable: 30,
    bonusCreditsClaimed: false,
  },
  activeProducts: [],
  productUsage: [],
  preferences: {
    showCosts: true,
    defaultTimeRange: '24h',
    compactMode: false,
  },
  dashboardLayouts: {} as Record<string, never>,
  favourites: DEMO_FAVOURITES,
  notifications: MOCK_NOTIFICATION_STATE,
};

export function useUserState() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure favourites array exists (migration for older saved states)
        if (!parsed.favourites) {
          parsed.favourites = [];
        }
        setUserState(parsed);
      } else {
        // Use demo state for new users
        setUserState(DEMO_USER_STATE);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER_STATE));
      }
    } catch {
      setUserState(DEMO_USER_STATE);
    }
    setIsLoading(false);
  }, []);

  // Save user state to localStorage whenever it changes
  useEffect(() => {
    if (userState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    }
  }, [userState]);

  // Complete a step and move to the next one
  const completeStep = useCallback((stepId: OnboardingStepId) => {
    setUserState((prev) => {
      if (!prev || !prev.onboarding) return prev;

      const stepIndex = prev.onboarding.steps.findIndex((s) => s.step === stepId);
      if (stepIndex === -1) return prev;

      const newSteps = [...prev.onboarding.steps];
      newSteps[stepIndex] = { ...newSteps[stepIndex], status: 'completed' };

      // Find next pending step
      const nextStep = newSteps.find((s) => s.status === 'pending' || s.status === 'in-progress');
      if (nextStep && nextStep.status === 'pending') {
        const nextIndex = newSteps.findIndex((s) => s.step === nextStep.step);
        newSteps[nextIndex] = { ...newSteps[nextIndex], status: 'in-progress' };
      }

      // Check if all steps are complete
      const allComplete = newSteps.every(
        (s) => s.status === 'completed' || s.status === 'skipped'
      );

      return {
        ...prev,
        emailVerified: stepId === 'confirm-email' ? true : prev.emailVerified,
        onboarding: {
          ...prev.onboarding,
          currentStep: nextStep?.step || prev.onboarding.currentStep,
          steps: newSteps,
          completedAt: allComplete ? new Date().toISOString() : undefined,
        },
      };
    });
  }, []);

  // Skip a step (only non-required steps)
  const skipStep = useCallback((stepId: OnboardingStepId) => {
    setUserState((prev) => {
      if (!prev || !prev.onboarding) return prev;

      const stepIndex = prev.onboarding.steps.findIndex((s) => s.step === stepId);
      if (stepIndex === -1) return prev;

      // Can only skip non-required steps
      if (prev.onboarding.steps[stepIndex].required) return prev;

      const newSteps = [...prev.onboarding.steps];
      newSteps[stepIndex] = { ...newSteps[stepIndex], status: 'skipped' };

      // Find next pending step
      const nextStep = newSteps.find((s) => s.status === 'pending');
      if (nextStep) {
        const nextIndex = newSteps.findIndex((s) => s.step === nextStep.step);
        newSteps[nextIndex] = { ...newSteps[nextIndex], status: 'in-progress' };
      }

      // Check if all steps are complete
      const allComplete = newSteps.every(
        (s) => s.status === 'completed' || s.status === 'skipped'
      );

      return {
        ...prev,
        onboarding: {
          ...prev.onboarding,
          currentStep: nextStep?.step || prev.onboarding.currentStep,
          steps: newSteps,
          completedAt: allComplete ? new Date().toISOString() : undefined,
        },
      };
    });
  }, []);

  // Claim bonus credits
  const claimBonusCredits = useCallback(() => {
    setUserState((prev) => {
      if (!prev || !prev.trial || prev.trial.bonusCreditsClaimed) return prev;

      return {
        ...prev,
        trial: {
          ...prev.trial,
          credits: prev.trial.credits + prev.trial.bonusCreditsAvailable,
          bonusCreditsClaimed: true,
        },
      };
    });
  }, []);

  // Check if onboarding is complete
  const isOnboardingComplete = useCallback(() => {
    if (!userState?.onboarding) return true;
    return !!userState.onboarding.completedAt;
  }, [userState]);

  // Check if user is in trial
  const isInTrial = useCallback(() => {
    if (!userState?.trial) return false;
    return userState.trial.isActive && new Date(userState.trial.endDate) > new Date();
  }, [userState]);

  // Reset onboarding (for demo/testing)
  const resetOnboarding = useCallback(() => {
    setUserState(DEMO_USER_STATE);
  }, []);

  // Complete onboarding entirely (skip to end)
  const completeOnboarding = useCallback(() => {
    setUserState((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        emailVerified: true,
        onboarding: null,
      };
    });
  }, []);

  // ===========================================
  // Favourites Methods
  // ===========================================

  // Add a resource to favourites
  const addFavourite = useCallback((
    resourceId: string,
    resourceType: ResourceHealth['type'],
    name: string,
    icon?: string
  ) => {
    setUserState((prev) => {
      if (!prev) return prev;

      // Check if already favourited
      if (prev.favourites.some(f => f.resourceId === resourceId)) {
        return prev;
      }

      const newFavourite: Favourite = {
        id: `fav-${Date.now()}`,
        resourceId,
        resourceType,
        name,
        icon,
        addedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        favourites: [...prev.favourites, newFavourite],
      };
    });
  }, []);

  // Remove a resource from favourites
  const removeFavourite = useCallback((resourceId: string) => {
    setUserState((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        favourites: prev.favourites.filter(f => f.resourceId !== resourceId),
      };
    });
  }, []);

  // Toggle favourite status
  const toggleFavourite = useCallback((
    resourceId: string,
    resourceType: ResourceHealth['type'],
    name: string,
    icon?: string
  ) => {
    setUserState((prev) => {
      if (!prev) return prev;

      const isFavourited = prev.favourites.some(f => f.resourceId === resourceId);

      if (isFavourited) {
        return {
          ...prev,
          favourites: prev.favourites.filter(f => f.resourceId !== resourceId),
        };
      } else {
        const newFavourite: Favourite = {
          id: `fav-${Date.now()}`,
          resourceId,
          resourceType,
          name,
          icon,
          addedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          favourites: [...prev.favourites, newFavourite],
        };
      }
    });
  }, []);

  // Check if a resource is favourited
  const isFavourited = useCallback((resourceId: string) => {
    return userState?.favourites?.some(f => f.resourceId === resourceId) ?? false;
  }, [userState]);

  return {
    userState,
    isLoading,
    completeStep,
    skipStep,
    claimBonusCredits,
    isOnboardingComplete,
    isInTrial,
    resetOnboarding,
    completeOnboarding,
    // Favourites
    addFavourite,
    removeFavourite,
    toggleFavourite,
    isFavourited,
  };
}
