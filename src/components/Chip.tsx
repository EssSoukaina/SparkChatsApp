import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export const Chip: React.FC<Props> = ({ label, selected = false, onPress }) => {
  const { theme } = useThemeContext();
  const backgroundColor = selected ? theme.colors.primary : 'transparent';
  const borderColor = selected ? theme.colors.primary : theme.colors.border;
  const color = selected ? '#FFFFFF' : theme.colors.text;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.base, { backgroundColor, borderColor }]}> 
      <Text style={{ color, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 40,
  },
});
