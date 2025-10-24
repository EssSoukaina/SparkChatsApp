import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type AuthSuccessScreenProps = NativeStackScreenProps<AuthStackParamList, 'AuthSuccess'>;

export const AuthSuccessScreen: React.FC<AuthSuccessScreenProps> = ({ route, navigation }) => {
  const { theme } = useThemeContext();
  const { title, message, ctaLabel = 'Continue', redirectTo } = route.params;
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.icon, { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}22` }]}> 
        <Text style={{ fontSize: 48, color: theme.colors.primary }}>✓</Text>
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.muted }]}>{message}</Text>
      <Button
        title={ctaLabel}
        onPress={() => {
          if (redirectTo) {
            navigation.navigate(redirectTo);
          } else {
            navigation.goBack();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
