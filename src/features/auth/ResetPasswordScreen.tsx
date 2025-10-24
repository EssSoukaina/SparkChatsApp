import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSignIn } from '@clerk/clerk-expo';
import { AuthStackParamList } from '../../navigation/types';
import { FormTextInput } from '../../components/FormTextInput';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type ResetPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      const result = await signIn.resetPassword({ password, signInId: signIn.id });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigation.navigate('AuthSuccess', {
          title: 'Password updated',
          message: 'You can now continue to SparkChats.',
          ctaLabel: 'Continue',
          redirectTo: 'SignIn',
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error?.errors?.[0]?.message ?? 'Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Set a new password</Text>
        <Text style={{ color: theme.colors.muted }}>Create a secure password with at least 8 characters.</Text>
      </View>
      <View style={styles.form}>
        <FormTextInput label="New password" value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Save password" onPress={handleSubmit} loading={loading} disabled={password.length < 8} />
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
