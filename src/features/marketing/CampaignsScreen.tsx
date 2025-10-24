import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { MarketingStackParamList } from '../../navigation/types';
import { campaignsApi } from '../../services/api';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';

export type CampaignsScreenProps = NativeStackScreenProps<MarketingStackParamList, 'Campaigns'>;

const statusTone = (status: string) => {
  switch (status) {
    case 'done':
      return 'done';
    case 'pending':
      return 'pending';
    case 'sending':
      return 'sending';
    default:
      return 'failed';
  }
};

export const CampaignsScreen: React.FC<CampaignsScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const { data: campaigns } = useQuery({ queryKey: ['campaigns'], queryFn: campaignsApi.listCampaigns });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={campaigns ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        ListHeaderComponent={() => (
          <Button title="New campaign" onPress={() => navigation.navigate('CreateCampaign')} />
        )}
        ListEmptyComponent={() => (
          <Text style={{ color: theme.colors.muted, textAlign: 'center', marginTop: 32 }}>No campaigns yet. Launch your first broadcast!</Text>
        )}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{item.name}</Text>
              <Badge label={item.status.toUpperCase()} tone={statusTone(item.status) as any} />
            </View>
            <Text style={{ color: theme.colors.muted }}>Schedule: {new Date(item.schedule).toLocaleString()}</Text>
            <View style={styles.statsRow}>
              <Text style={{ color: theme.colors.text }}>Sent: {item.stats.sent}</Text>
              <Text style={{ color: theme.colors.text }}>Delivered: {item.stats.delivered}</Text>
              <Text style={{ color: theme.colors.text }}>Read: {item.stats.read}</Text>
            </View>
            <Button title="View report" variant="outline" onPress={() => navigation.navigate('CampaignReview', { id: item.id })} />
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
});
