import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

type BadgeTone = 'pending' | 'sending' | 'done' | 'failed' | 'info';

type Props = {
  label: string;
  tone?: BadgeTone;
};

export const Badge: React.FC<Props> = ({ label, tone = 'info' }) => {
  const { theme } = useThemeContext();
  const backgroundColor = {
    pending: theme.colors.chipPending,
    sending: theme.colors.chipSending,
    done: theme.colors.chipDone,
    failed: theme.colors.chipFailed,
    info: theme.colors.info,
  }[tone];

  return (
    <View style={[styles.base, { backgroundColor }]}> 
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
});
