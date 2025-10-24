import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketingStackParamList } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type MarketingHomeScreenProps = NativeStackScreenProps<MarketingStackParamList, 'MarketingHome'>;

export const MarketingHomeScreen: React.FC<MarketingHomeScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Card>
        <Text style={[styles.title, { color: theme.colors.text }]}>Campaigns</Text>
        <Text style={{ color: theme.colors.muted, marginBottom: 16 }}>Build broadcasts and schedule them in minutes.</Text>
        <Button title="View campaigns" onPress={() => navigation.navigate('Campaigns')} />
      </Card>
      <Card>
        <Text style={[styles.title, { color: theme.colors.text }]}>Templates</Text>
        <Text style={{ color: theme.colors.muted, marginBottom: 16 }}>Reuse approved messages to scale quickly.</Text>
        <Button title="Explore templates" onPress={() => navigation.navigate('Templates')} />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
});
