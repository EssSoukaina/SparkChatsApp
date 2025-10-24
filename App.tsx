import React from 'react';
import { ClerkProvider, ClerkLoaded, createExpoTokenCache } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import './src/i18n';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, useThemeContext } from './src/theme/ThemeProvider';
import { ApiAuthBridge } from './src/services/api/token';
import { navigationThemeFactory } from './src/theme/navigation';
import { usePreferenceStore } from './src/stores/settings';

const queryClient = new QueryClient();

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  'pk_test_cHJvdmVuLXNhaWxmaXNoLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';

function AppContainer() {
  const { theme, setMode } = useThemeContext();
  const preferenceMode = usePreferenceStore((state) => state.theme);

  React.useEffect(() => {
    setMode(preferenceMode);
  }, [preferenceMode, setMode]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationThemeFactory(theme)}>
          <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
          <ApiAuthBridge />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={createExpoTokenCache()}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AppContainer />
          </ThemeProvider>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
