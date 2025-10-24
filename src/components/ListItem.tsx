import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
};

export const ListItem: React.FC<Props> = ({ title, subtitle, onPress, rightElement, leftElement }) => {
  const { theme } = useThemeContext();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
    >
      {leftElement}
      <View style={styles.texts}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {subtitle ? <Text style={{ color: theme.colors.muted }}>{subtitle}</Text> : null}
      </View>
      {rightElement}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  texts: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
