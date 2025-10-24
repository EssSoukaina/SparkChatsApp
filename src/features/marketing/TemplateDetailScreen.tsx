import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { MarketingStackParamList } from '../../navigation/types';
import { templatesApi } from '../../services/api';
import { useThemeContext } from '../../theme/ThemeProvider';
import { PhoneMockPreview } from '../../components/PhoneMockPreview';
import { Button } from '../../components/Button';

export type TemplateDetailScreenProps = NativeStackScreenProps<MarketingStackParamList, 'TemplateDetail'>;

export const TemplateDetailScreen: React.FC<TemplateDetailScreenProps> = ({ route, navigation }) => {
  const { theme } = useThemeContext();
  const { data: template } = useQuery({ queryKey: ['template', route.params.id], queryFn: () => templatesApi.getTemplate(route.params.id) });

  if (!template) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.text }]}>{template.name}</Text>
      <Text style={{ color: theme.colors.muted }}>Type: {template.type}</Text>
      <Text style={{ color: theme.colors.muted }}>Variables: {template.variables.join(', ')}</Text>
      <PhoneMockPreview message={`Preview of ${template.name}`} />
      <Button title="Use this template" onPress={() => navigation.navigate('CreateCampaign')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
});
