import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSignIn } from '@clerk/clerk-expo';
import { AuthStackParamList } from '../../navigation/types';
import { FormTextInput } from '../../components/FormTextInput';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type SignInScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      }
    } catch (error: any) {
      Alert.alert('Login failed', error?.errors?.[0]?.message ?? 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Welcome to SparkChats</Text>
        <Text style={{ color: theme.colors.muted }}>Log in to continue</Text>
      </View>
      <View style={styles.form}>
        <FormTextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <FormTextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Sign in" onPress={handleSubmit} loading={loading} disabled={!email || !password} />
        <Button title="Forgot password?" variant="ghost" onPress={() => navigation.navigate('ForgotPassword')} />
        <Button title="Create account" variant="outline" onPress={() => navigation.navigate('SignUp')} />
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
