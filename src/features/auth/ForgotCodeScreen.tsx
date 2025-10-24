import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSignIn } from '@clerk/clerk-expo';
import { AuthStackParamList } from '../../navigation/types';
import { OTPInput } from '../../components/OTPInput';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type ForgotCodeScreenProps = NativeStackScreenProps<AuthStackParamList, 'ForgotCode'>;

export const ForgotCodeScreen: React.FC<ForgotCodeScreenProps> = ({ route, navigation }) => {
  const { theme } = useThemeContext();
  const { signIn, isLoaded } = useSignIn();
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
      });
      if (result.status === 'needs_second_factor' || result.status === 'needs_new_password') {
        navigation.navigate('ResetPassword', { email: route.params.email });
      }
    } catch (error: any) {
      Alert.alert('Invalid code', error?.errors?.[0]?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Enter reset code</Text>
        <Text style={{ color: theme.colors.muted }}>We emailed a 6-digit code to {route.params.email}</Text>
      </View>
      <View style={styles.form}>
        <OTPInput value={code} onChange={setCode} />
        <Button title="Continue" onPress={handleSubmit} disabled={code.length < 6} loading={loading} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 24,
    gap: 24,
  },
  header: {
    gap: 8,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  form: {
    gap: 16,
    alignItems: 'center',
  },
});
