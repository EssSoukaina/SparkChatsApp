import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSignIn } from '@clerk/clerk-expo';
import { AuthStackParamList } from '../../navigation/types';
import { FormTextInput } from '../../components/FormTextInput';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email });
      navigation.navigate('ForgotCode', { email });
    } catch (error: any) {
      Alert.alert('Error', error?.errors?.[0]?.message ?? 'Unable to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Forgot password</Text>
        <Text style={{ color: theme.colors.muted }}>Enter your email to receive a reset code.</Text>
      </View>
      <View style={styles.form}>
        <FormTextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Button title="Send code" onPress={handleSubmit} loading={loading} disabled={!email} />
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
  },
});
