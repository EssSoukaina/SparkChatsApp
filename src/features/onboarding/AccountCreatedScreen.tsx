import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type AccountCreatedScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'AccountCreated'>;

export const AccountCreatedScreen: React.FC<AccountCreatedScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.icon, { borderColor: theme.colors.primary }]}>
        <Text style={{ color: theme.colors.primary, fontSize: 60 }}>✓</Text>
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>Account created</Text>
      <Text style={[styles.message, { color: theme.colors.muted }]}>Let’s set up your business profile so you can start messaging.</Text>
      <Button title="Set up business profile" onPress={() => navigation.navigate('BusinessProfile')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 20,
  },
  icon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
