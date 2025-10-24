import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../theme/ThemeProvider';

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useThemeContext();
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(bottom, 12),
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icon = options.tabBarIcon?.({
          color: isFocused ? '#FFFFFF' : theme.colors.muted,
          size: 22,
          focused: isFocused,
        });

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.item}
          >
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isFocused ? theme.colors.primary : 'transparent',
                },
              ]}
            >
              {icon}
            </View>
            <Text style={{ color: isFocused ? theme.colors.primary : theme.colors.muted, fontSize: 12 }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
