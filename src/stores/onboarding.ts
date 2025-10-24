import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type QuestionnaireAnswers = {
  goal?: string;
  audienceSize?: string;
  channelExperience?: string;
};

type BusinessProfile = {
  businessName: string;
  businessPhone: string;
  category: string;
  useVerifiedNumber: boolean;
};

interface OnboardingState {
  hasSeenPaywall: boolean;
  hasSubscribed: boolean;
  questionnaire: QuestionnaireAnswers;
  businessProfile?: BusinessProfile;
  completePaywall: (subscribed: boolean) => void;
  updateQuestionnaire: (payload: QuestionnaireAnswers) => void;
  setBusinessProfile: (payload: BusinessProfile) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenPaywall: false,
      hasSubscribed: false,
      questionnaire: {},
      businessProfile: undefined,
      completePaywall: (subscribed) => set({ hasSeenPaywall: true, hasSubscribed: subscribed }),
      updateQuestionnaire: (payload) => set((state) => ({ questionnaire: { ...state.questionnaire, ...payload } })),
      setBusinessProfile: (payload) => set({ businessProfile: payload }),
      reset: () =>
        set({
          hasSeenPaywall: false,
          hasSubscribed: false,
          questionnaire: {},
          businessProfile: undefined,
        }),
    }),
    {
      name: 'spark-onboarding-store',
      version: 1,
    }
  )
);
