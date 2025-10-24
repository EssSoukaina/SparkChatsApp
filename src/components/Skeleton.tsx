import React from 'react';
import { Animated, StyleSheet, View, ViewProps } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

export const Skeleton: React.FC<ViewProps> = ({ style }) => {
  const { theme } = useThemeContext();
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.base, { backgroundColor: theme.colors.border, opacity }, style]} />;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    width: '100%',
    height: 16,
  },
});
