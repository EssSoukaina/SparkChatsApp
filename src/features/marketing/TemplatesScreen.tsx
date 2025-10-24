import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { MarketingStackParamList } from '../../navigation/types';
import { templatesApi } from '../../services/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { useThemeContext } from '../../theme/ThemeProvider';

export type TemplatesScreenProps = NativeStackScreenProps<MarketingStackParamList, 'Templates'>;

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const [tab, setTab] = React.useState<'approved' | 'drafts'>('approved');
  const { data: templates } = useQuery({ queryKey: ['templates'], queryFn: templatesApi.listTemplates });

  const filtered = templates?.filter((template) => (tab === 'approved' ? true : false));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.tabRow}>
        <Chip label="Approved" selected={tab === 'approved'} onPress={() => setTab('approved')} />
        <Chip label="Drafts" selected={tab === 'drafts'} onPress={() => setTab('drafts')} />
      </View>
      <FlatList
        data={filtered ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        renderItem={({ item }) => (
          <Card>
            <Text style={[styles.title, { color: theme.colors.text }]}>{item.name}</Text>
            <Text style={{ color: theme.colors.muted }}>Type: {item.type}</Text>
            <Text style={{ color: theme.colors.muted }}>Language: {item.language}</Text>
            <Text style={{ color: theme.colors.muted }}>Variables: {item.variables.join(', ')}</Text>
            <Button title="Use this template" onPress={() => navigation.navigate('TemplateDetail', { id: item.id })} />
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
});
