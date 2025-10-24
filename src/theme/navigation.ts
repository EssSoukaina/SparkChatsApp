import { Theme as NavigationTheme } from '@react-navigation/native';
import { AppTheme } from './ThemeProvider';

export const navigationThemeFactory = (theme: AppTheme): NavigationTheme => ({
  dark: theme.mode === 'dark',
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.primary,
  },
});
