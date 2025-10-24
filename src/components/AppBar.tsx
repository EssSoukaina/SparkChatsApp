import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

interface Props {
  title: string;
  trailing?: React.ReactNode;
  leading?: React.ReactNode;
}

export const AppBar: React.FC<Props> = ({ title, trailing, leading }) => {
  const { theme } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.leading}>{leading}</View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <View style={styles.trailing}>{trailing}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  leading: {
    minWidth: 48,
  },
  trailing: {
    minWidth: 48,
    alignItems: 'flex-end',
    flexShrink: 0,
  },
});
