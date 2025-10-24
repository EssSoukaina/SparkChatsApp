import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

type Props = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
};

export const FormTextInput: React.FC<Props> = ({ label, hint, error, ...rest }) => {
  const { theme } = useThemeContext();
  const borderColor = error ? theme.colors.error : theme.colors.border;
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.muted}
        style={[
          styles.input,
          {
            borderColor,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
          },
        ]}
        {...rest}
      />
      {hint && !error && <Text style={[styles.hint, { color: theme.colors.muted }]}>{hint}</Text>}
      {error && <Text style={[styles.hint, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
  },
});
