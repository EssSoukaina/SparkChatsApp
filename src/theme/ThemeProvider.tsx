import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export type AppTheme = {
  mode: 'light' | 'dark';
  modePreference: ThemeMode;
  colors: {
    primary: string;
    background: string;
    card: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    chipPending: string;
    chipSending: string;
    chipDone: string;
    chipFailed: string;
  };
  typography: {
    heading: number;
    body: number;
    small: number;
  };
};

const PRIMARY = '#4CA64C';

const lightTheme: AppTheme = {
  mode: 'light',
  modePreference: 'light',
  colors: {
    primary: PRIMARY,
    background: '#F3F5F4',
    card: '#FFFFFF',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    muted: '#64748B',
    success: '#16A34A',
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#2563EB',
    chipPending: '#64748B',
    chipSending: '#2563EB',
    chipDone: '#16A34A',
    chipFailed: '#DC2626',
  },
  typography: {
    heading: 28,
    body: 16,
    small: 14,
  },
};

const darkTheme: AppTheme = {
  ...lightTheme,
  mode: 'dark',
  colors: {
    primary: PRIMARY,
    background: '#0B1120',
    card: '#111827',
    surface: '#1F2937',
    border: '#334155',
    text: '#F1F5F9',
    muted: '#94A3B8',
    success: '#22C55E',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#3B82F6',
    chipPending: '#94A3B8',
    chipSending: '#60A5FA',
    chipDone: '#4ADE80',
    chipFailed: '#F87171',
  },
};

interface ThemeContextValue {
  theme: AppTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const resolvedTheme = useMemo(() => {
    const targetMode = mode === 'system' ? systemColorScheme ?? 'light' : mode;
    const base = targetMode === 'dark' ? darkTheme : lightTheme;
    return { ...base, mode: targetMode, modePreference: mode } as AppTheme;
  }, [mode, systemColorScheme]);

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      setMode,
    }),
    [resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used inside ThemeProvider');
  }
  return ctx;
};
