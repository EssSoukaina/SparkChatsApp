import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSignUp } from '@clerk/clerk-expo';
import { AuthStackParamList } from '../../navigation/types';
import { OTPInput } from '../../components/OTPInput';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type VerifyEmailScreenProps = NativeStackScreenProps<AuthStackParamList, 'VerifyEmail'>;

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ route, navigation }) => {
  const { theme } = useThemeContext();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [code, setCode] = React.useState('');
  const [attempts, setAttempts] = React.useState(0);
  const [lockedUntil, setLockedUntil] = React.useState<Date | null>(null);
  const [resendTimer, setResendTimer] = React.useState(30);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = async () => {
    if (!isLoaded || code.length < 6) return;
    if (lockedUntil && lockedUntil > new Date()) {
      Alert.alert('Too many attempts', 'Please wait a few minutes before trying again.');
      return;
    }
    try {
      setLoading(true);
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      }
    } catch (error: any) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 10) {
        setLockedUntil(new Date(Date.now() + 15 * 60 * 1000));
        Alert.alert('Too many attempts', 'You are locked out for 15 minutes.');
      } else if (nextAttempts >= 3) {
        Alert.alert('Incorrect code', 'Check your email for the latest code.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!isLoaded || resendTimer > 0) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setResendTimer(30);
    } catch (error) {
      Alert.alert('Unable to resend', 'Please try again later.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Verify your email</Text>
        <Text style={{ color: theme.colors.muted }}>
          Enter the 6-digit code sent to {route.params.email}
        </Text>
      </View>
      <View style={styles.form}>
        <OTPInput value={code} onChange={setCode} />
        <Button title="Verify" onPress={handleVerify} disabled={code.length < 6 || loading} loading={loading} />
        <Button
          title={resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
          onPress={resendCode}
          variant="ghost"
          disabled={resendTimer > 0}
        />
        <Button title="Back to sign in" variant="ghost" onPress={() => navigation.navigate('SignIn')} />
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
    gap: 12,
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
