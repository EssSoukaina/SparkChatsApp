import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSignUp } from '@clerk/clerk-expo';
import { useTranslation } from 'react-i18next';
import { AuthStackParamList } from '../../navigation/types';
import { FormTextInput } from '../../components/FormTextInput';
import { Checkbox } from '../../components/Checkbox';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const { isLoaded, signUp } = useSignUp();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [accepted, setAccepted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const canSubmit = name.length > 1 && email.length > 3 && password.length >= 6 && accepted;

  const handleSubmit = async () => {
    if (!isLoaded || !canSubmit) return;
    try {
      setLoading(true);
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      navigation.navigate('VerifyEmail', { email });
    } catch (error: any) {
      Alert.alert('Sign up failed', error?.errors?.[0]?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('welcome')}</Text>
        <Text style={{ color: theme.colors.muted, fontSize: 16 }}>Create your SparkChats account</Text>
      </View>
      <View style={styles.form}>
        <FormTextInput label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
        <FormTextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <FormTextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Checkbox label="I agree to the Terms of Service" checked={accepted} onToggle={setAccepted} />
        <Button title="Create account" onPress={handleSubmit} disabled={!canSubmit} loading={loading} />
        <Button title="Already have an account? Sign in" variant="ghost" onPress={() => navigation.navigate('SignIn')} />
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
