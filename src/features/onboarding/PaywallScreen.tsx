import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { OnboardingStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { useThemeContext } from '../../theme/ThemeProvider';
import { useOnboardingStore } from '../../stores/onboarding';
import { subscriptionApi } from '../../services/api';

export type PaywallScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'Paywall'>;

export const PaywallScreen: React.FC<PaywallScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const completePaywall = useOnboardingStore((state) => state.completePaywall);
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = React.useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = React.useState(false);

  const subscribe = async () => {
    try {
      setLoading(true);
      await subscriptionApi.checkoutSubscription({ plan: selectedPlan });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      completePaywall(true);
      navigation.navigate('Questionnaire');
    } catch (error) {
      Alert.alert('Subscription failed', 'Unable to activate your subscription right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.text }]}>{'Unlock SparkChats Pro'}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>Choose the plan that suits your growth.</Text>
      <View style={styles.cards}>
        <Card style={[styles.card, selectedPlan === 'monthly' && styles.cardActive]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Monthly</Text>
          <Text style={[styles.cardPrice, { color: theme.colors.text }]}>$39</Text>
          <Text style={{ color: theme.colors.muted }}> billed every month </Text>
          <Button title="Choose" variant={selectedPlan === 'monthly' ? 'solid' : 'outline'} onPress={() => setSelectedPlan('monthly')} />
        </Card>
        <Card style={[styles.card, selectedPlan === 'yearly' && styles.cardActive]}>
          <Badge label="10% off" tone="done" />
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Yearly</Text>
          <Text style={[styles.cardPrice, { color: theme.colors.text }]}>$421</Text>
          <Text style={{ color: theme.colors.muted }}> billed annually </Text>
          <Button title="Choose" variant={selectedPlan === 'yearly' ? 'solid' : 'outline'} onPress={() => setSelectedPlan('yearly')} />
        </Card>
      </View>
      <View style={styles.actions}>
        <Button title="Start Pro plan" onPress={subscribe} loading={loading} />
        <Button
          title="Continue trial"
          variant="ghost"
          onPress={() => {
            completePaywall(false);
            navigation.navigate('Questionnaire');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  cards: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    gap: 12,
    alignItems: 'center',
  },
  cardActive: {
    borderWidth: 2,
    borderColor: '#4CA64C',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardPrice: {
    fontSize: 26,
    fontWeight: '800',
  },
  actions: {
    gap: 12,
  },
});
