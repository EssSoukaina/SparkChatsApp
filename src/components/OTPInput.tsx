import React, { useMemo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  cells?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, cells = 6 }) => {
  const { theme } = useThemeContext();
  const digits = useMemo(() => value.split('').slice(0, cells), [value, cells]);
  return (
    <View style={styles.container}>
      {Array.from({ length: cells }).map((_, index) => (
        <TextInput
          key={index}
          keyboardType="number-pad"
          maxLength={1}
          value={digits[index] ?? ''}
          style={[
            styles.cell,
            {
              color: theme.colors.text,
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.surface,
            },
          ]}
          onChangeText={(text) => {
            const normalized = (text ?? '').replace(/\D/g, '');
            const next = value.split('');
            next[index] = normalized;
            onChange(next.join('').slice(0, cells));
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cell: {
    width: 48,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
});
