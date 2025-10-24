import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MarketingStackParamList } from '../../navigation/types';
import { campaignsApi } from '../../services/api';
import { useThemeContext } from '../../theme/ThemeProvider';
import { KPIStat } from '../../components/KPIStat';
import { LineChart } from '../../components/LineChart';
import { Button } from '../../components/Button';

export type CampaignReviewScreenProps = NativeStackScreenProps<MarketingStackParamList, 'CampaignReview'>;

const FAILURE_REASONS = [
  { reason: 'Opted out', count: 40 },
  { reason: 'Invalid number', count: 35 },
  { reason: 'Spam filter', count: 25 },
];

export const CampaignReviewScreen: React.FC<CampaignReviewScreenProps> = ({ route }) => {
  const { theme } = useThemeContext();
  const queryClient = useQueryClient();
  const { data: campaign } = useQuery({
    queryKey: ['campaign', route.params.id],
    queryFn: () => campaignsApi.getCampaign(route.params.id),
  });
  const { data: stats } = useQuery({
    queryKey: ['campaignStats', route.params.id],
    queryFn: () => campaignsApi.getCampaignStats({ id: route.params.id }),
  });

  const duplicateMutation = useMutation({
    mutationFn: campaignsApi.duplicateCampaign,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });

  const exportMutation = useMutation({
    mutationFn: (format: 'csv' | 'pdf') => campaignsApi.exportCampaign({ id: route.params.id, format }),
  });

  if (!campaign) {
    return null;
  }

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View style={{ padding: 20, gap: 20, backgroundColor: theme.colors.background }}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{campaign.name}</Text>
            <Text style={{ color: theme.colors.muted }}>Status: {campaign.status}</Text>
          </View>
          <View style={styles.kpiRow}>
            <KPIStat label="Sent" value={campaign.stats.sent.toString()} />
            <KPIStat label="Delivered" value={campaign.stats.delivered.toString()} />
            <KPIStat label="Read" value={campaign.stats.read.toString()} />
            <KPIStat label="CTR" value={`${(campaign.stats.ctr * 100).toFixed(1)}%`} />
          </View>
          <View style={{ alignItems: 'center', gap: 12 }}>
            <Text style={{ color: theme.colors.text, fontWeight: '600' }}>Delivery timeline</Text>
            <LineChart data={(stats?.timeline ?? []).map((item) => item.delivered)} />
          </View>
          <View>
            <Text style={{ color: theme.colors.text, fontWeight: '600', marginBottom: 8 }}>Top failure reasons</Text>
            {FAILURE_REASONS.map((item) => (
              <View key={item.reason} style={styles.reasonRow}>
                <Text style={{ color: theme.colors.text }}>{item.reason}</Text>
                <Text style={{ color: theme.colors.muted }}>{item.count}</Text>
              </View>
            ))}
          </View>
          <View style={styles.actionRow}>
            <Button title="Resend" onPress={() => duplicateMutation.mutate({ id: route.params.id })} />
            <Button title="Duplicate" variant="outline" onPress={() => duplicateMutation.mutate({ id: route.params.id })} />
            <Button
              title={exportMutation.isPending ? 'Exporting…' : 'Export CSV'}
              variant="outline"
              onPress={() => exportMutation.mutate('csv')}
            />
          </View>
        </View>
      }
      renderItem={() => null}
    />
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reasonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
});
