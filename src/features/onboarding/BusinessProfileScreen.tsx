import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { OnboardingStackParamList } from '../../navigation/types';
import { FormTextInput } from '../../components/FormTextInput';
import { Chip } from '../../components/Chip';
import { Checkbox } from '../../components/Checkbox';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';
import { useOnboardingStore } from '../../stores/onboarding';
import { orgApi } from '../../services/api';

export type BusinessProfileScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'BusinessProfile'>;

const COUNTRIES = [
  { code: '+212', label: 'Morocco' },
  { code: '+33', label: 'France' },
  { code: '+1', label: 'USA' },
];

export const BusinessProfileScreen: React.FC<BusinessProfileScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const [country, setCountry] = React.useState(COUNTRIES[0]);
  const [businessName, setBusinessName] = React.useState('Green Studio');
  const [phone, setPhone] = React.useState('0600000000');
  const [category, setCategory] = React.useState('Retail');
  const [useVerified, setUseVerified] = React.useState(true);
  const setBusinessProfile = useOnboardingStore((state) => state.setBusinessProfile);
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await orgApi.updateOrg({
        name: businessName,
        businessPhone: `${country.code}${phone}`,
        category,
        wabaStatus: useVerified ? 'active' : 'pending',
      } as any);
      setBusinessProfile({
        businessName,
        businessPhone: `${country.code}${phone}`,
        category,
        useVerifiedNumber: useVerified,
      });
      await queryClient.invalidateQueries({ queryKey: ['org'] });
    } catch (error) {
      Alert.alert('Error', 'Unable to save your business profile right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.text }]}>Set up business profile</Text>
      <FormTextInput label="Business name" value={businessName} onChangeText={setBusinessName} />
      <Text style={{ color: theme.colors.muted }}>Business phone</Text>
      <View style={styles.countryRow}>
        {COUNTRIES.map((item) => (
          <Chip
            key={item.code}
            label={`${item.label} ${item.code}`}
            selected={country.code === item.code}
            onPress={() => setCountry(item)}
          />
        ))}
      </View>
      <FormTextInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <FormTextInput label="Category" value={category} onChangeText={setCategory} />
      <Checkbox label="Use verified number" checked={useVerified} onToggle={setUseVerified} />
      <Button title="Finish onboarding" onPress={handleSubmit} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  countryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
