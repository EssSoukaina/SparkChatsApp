import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

type ButtonVariant = 'solid' | 'outline' | 'ghost';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  testID?: string;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled,
  loading,
  variant = 'solid',
  icon,
  testID,
}) => {
  const { theme } = useThemeContext();
  const isDisabled = disabled || loading;

  const backgroundColor = {
    solid: theme.colors.primary,
    outline: 'transparent',
    ghost: 'transparent',
  }[variant];

  const borderColor = variant === 'outline' ? theme.colors.primary : 'transparent';
  const textColor = variant === 'solid' ? '#FFFFFF' : theme.colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          opacity: isDisabled ? 0.6 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      disabled={isDisabled}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? '#FFFFFF' : theme.colors.primary} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, { color: textColor }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
