import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode } from '../theme/ThemeProvider';

type NotificationPrefs = {
  marketing: boolean;
  messages: boolean;
};

type PreferenceState = {
  language: 'en' | 'fr' | 'ar';
  theme: ThemeMode;
  notifications: NotificationPrefs;
  twoFactor: boolean;
  setLanguage: (language: 'en' | 'fr' | 'ar') => void;
  setTheme: (theme: ThemeMode) => void;
  toggleNotification: (key: keyof NotificationPrefs, value: boolean) => void;
  setTwoFactor: (value: boolean) => void;
};

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'system',
      notifications: {
        marketing: true,
        messages: true,
      },
      twoFactor: false,
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      toggleNotification: (key, value) =>
        set((state) => ({ notifications: { ...state.notifications, [key]: value } })),
      setTwoFactor: (value) => set({ twoFactor: value }),
    }),
    {
      name: 'spark-preference-store',
      version: 1,
    }
  )
);
