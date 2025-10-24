import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

interface Props {
  label: string;
  value: string;
  caption?: string;
}

export const KPIStat: React.FC<Props> = ({ label, value, caption }) => {
  const { theme } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.colors.muted }]}>{label}</Text>
      {caption ? <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{caption}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
    flex: 1,
    minWidth: 120,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
