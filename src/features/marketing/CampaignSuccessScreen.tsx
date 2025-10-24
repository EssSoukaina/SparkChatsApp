import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketingStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type CampaignSuccessScreenProps = NativeStackScreenProps<MarketingStackParamList, 'CampaignSuccess'>;

export const CampaignSuccessScreen: React.FC<CampaignSuccessScreenProps> = ({ navigation, route }) => {
  const { theme } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.icon, { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}22` }]}> 
        <Text style={{ color: theme.colors.primary, fontSize: 64 }}>✓</Text>
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>Your campaign has been successfully delivered!</Text>
      <Text style={{ color: theme.colors.muted, textAlign: 'center' }}>Check how it performed in the analytics dashboard.</Text>
      <Button title="View report" onPress={() => navigation.replace('CampaignReview', { id: route.params.id })} />
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
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
});
