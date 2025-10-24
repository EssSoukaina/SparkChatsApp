import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMe } from '../../hooks/useMe';
import { useOrg } from '../../hooks/useOrg';
import { useThemeContext } from '../../theme/ThemeProvider';
import { usePreferenceStore } from '../../stores/settings';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { ListItem } from '../../components/ListItem';

export const SettingsScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const { data: me } = useMe();
  const { data: org } = useOrg();
  const { i18n } = useTranslation();
  const setLanguage = usePreferenceStore((state) => state.setLanguage);
  const setThemePref = usePreferenceStore((state) => state.setTheme);
  const preferenceTheme = usePreferenceStore((state) => state.theme);
  const notifications = usePreferenceStore((state) => state.notifications);
  const toggleNotification = usePreferenceStore((state) => state.toggleNotification);
  const twoFactor = usePreferenceStore((state) => state.twoFactor);
  const setTwoFactor = usePreferenceStore((state) => state.setTwoFactor);

  const changeLanguage = (language: 'en' | 'fr' | 'ar') => {
    setLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.section, { color: theme.colors.text }]}>Profile</Text>
      <Card>
        <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{me?.user.name}</Text>
        <Text style={{ color: theme.colors.muted }}>{me?.user.email}</Text>
        <Text style={{ color: theme.colors.muted }}>Business: {org?.name}</Text>
        <Button title="Edit profile" variant="outline" onPress={() => {}} />
      </Card>
      <Text style={[styles.section, { color: theme.colors.text }]}>Account security</Text>
      <Card>
        <ListItem title="Change email" onPress={() => {}} />
        <ListItem title="Change password" onPress={() => {}} />
        <View style={styles.switchRow}>
          <Text style={{ color: theme.colors.text }}>Two-factor authentication</Text>
          <Switch value={twoFactor} onValueChange={setTwoFactor} />
        </View>
      </Card>
      <Text style={[styles.section, { color: theme.colors.text }]}>Preferences</Text>
      <Card>
        <Text style={{ color: theme.colors.muted }}>Language</Text>
        <View style={styles.row}>
          {['en', 'fr', 'ar'].map((language) => (
            <Chip key={language} label={language.toUpperCase()} selected={i18n.language === language} onPress={() => changeLanguage(language as 'en' | 'fr' | 'ar')} />
          ))}
        </View>
        <Text style={{ color: theme.colors.muted }}>Theme</Text>
        <View style={styles.row}>
          {['light', 'dark', 'system'].map((mode) => (
            <Chip key={mode} label={mode} selected={preferenceTheme === mode} onPress={() => setThemePref(mode as any)} />
          ))}
        </View>
      </Card>
      <Text style={[styles.section, { color: theme.colors.text }]}>Notifications</Text>
      <Card>
        <View style={styles.switchRow}>
          <Text style={{ color: theme.colors.text }}>Messages</Text>
          <Switch value={notifications.messages} onValueChange={(value) => toggleNotification('messages', value)} />
        </View>
        <View style={styles.switchRow}>
          <Text style={{ color: theme.colors.text }}>Marketing updates</Text>
          <Switch value={notifications.marketing} onValueChange={(value) => toggleNotification('marketing', value)} />
        </View>
      </Card>
      <Text style={[styles.section, { color: theme.colors.text }]}>Subscription</Text>
      <Card>
        <Text style={{ color: theme.colors.text }}>Plan: {me?.user.subscribed ? 'Pro' : 'Trial'}</Text>
        <Button title="Upgrade" onPress={() => {}} />
      </Card>
      <Text style={[styles.section, { color: theme.colors.text }]}>Support</Text>
      <Card>
        <ListItem title="Reports & exports" onPress={() => {}} />
        <ListItem title="Help center" onPress={() => {}} />
        <ListItem title="About SparkChats" onPress={() => {}} />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
