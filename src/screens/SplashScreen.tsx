import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

export const SplashScreen: React.FC = () => {
  const { theme } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.primary }]}>SparkChats</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
});
