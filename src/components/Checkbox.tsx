import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

interface Props {
  label: string;
  checked: boolean;
  onToggle: (value: boolean) => void;
}

export const Checkbox: React.FC<Props> = ({ label, checked, onToggle }) => {
  const { theme } = useThemeContext();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onToggle(!checked)}
      style={styles.row}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: theme.colors.primary,
            backgroundColor: checked ? theme.colors.primary : 'transparent',
          },
        ]}
      />
      <Text style={{ color: theme.colors.text, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
  },
});
