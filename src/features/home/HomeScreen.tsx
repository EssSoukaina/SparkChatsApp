import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { campaignsApi, notificationsApi, templatesApi } from '../../services/api';
import { useMe } from '../../hooks/useMe';
import { AppBar } from '../../components/AppBar';
import { Card } from '../../components/Card';
import { KPIStat } from '../../components/KPIStat';
import { LineChart } from '../../components/LineChart';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';
import type { MainTabParamList } from '../../navigation/types';

export const HomeScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { data: meData } = useMe();
  const { data: campaignsData } = useQuery({ queryKey: ['campaigns'], queryFn: campaignsApi.listCampaigns });
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.listNotifications,
  });
  useQuery({ queryKey: ['templates'], queryFn: templatesApi.listTemplates });

  const campaign = campaignsData?.[0];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppBar title={`Hello ${meData?.user.name ?? ''}`} />
      <View style={styles.container}>
        <Card>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Trial checklist</Text>
          <View style={styles.checklist}>
            {['Import contacts', 'Create first campaign', 'Preview & schedule', 'Review analytics'].map((step, index) => (
              <View key={step} style={styles.checkItem}>
                <Text style={{ color: theme.colors.primary, fontSize: 18 }}>✓</Text>
                <Text style={{ color: theme.colors.text }}>{`${index + 1}. ${step}`}</Text>
              </View>
            ))}
          </View>
          <Button title="Create campaign" onPress={() => navigation.navigate('Marketing', { screen: 'CreateCampaign' } as any)} />
        </Card>
        {campaign ? (
          <Card>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{campaign.name}</Text>
            <View style={styles.kpiRow}>
              <KPIStat label="Sent" value={campaign.stats.sent.toString()} />
              <KPIStat label="Delivered" value={campaign.stats.delivered.toString()} />
              <KPIStat label="Read" value={campaign.stats.read.toString()} />
            </View>
            <View style={styles.chartRow}>
              <Text style={{ color: theme.colors.muted }}>Timeline</Text>
              <LineChart data={campaign.timeline.map((item) => item.delivered)} />
            </View>
          </Card>
        ) : null}
        <Card>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Notifications</Text>
          {notifications?.map((notification) => (
            <View key={notification.id} style={styles.notificationRow}>
              <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{notification.title}</Text>
              <Text style={{ color: theme.colors.muted }}>{notification.body}</Text>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  checklist: {
    gap: 12,
    marginBottom: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  chartRow: {
    gap: 12,
    alignItems: 'center',
  },
  notificationRow: {
    gap: 4,
    marginBottom: 12,
  },
});
