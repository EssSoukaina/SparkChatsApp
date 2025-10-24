import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const Radio: React.FC<Props> = ({ label, selected, onPress }) => {
  const { theme } = useThemeContext();
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={styles.row}>
      <View style={[styles.outer, { borderColor: theme.colors.primary }]}> 
        {selected && <View style={[styles.inner, { backgroundColor: theme.colors.primary }]} />}
      </View>
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
  outer: {
    width: 22,
    height: 22,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 12,
  },
});
