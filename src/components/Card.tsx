import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

export const Card: React.FC<ViewProps> = ({ style, ...rest }) => {
  const { theme } = useThemeContext();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.mode === 'dark' ? '#000' : '#0F172A',
        },
        style,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    padding: 20,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});
