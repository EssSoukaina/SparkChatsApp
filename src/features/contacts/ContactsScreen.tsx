import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { contactsApi } from '../../services/api';
import { useThemeContext } from '../../theme/ThemeProvider';
import { AppBar } from '../../components/AppBar';
import { Chip } from '../../components/Chip';
import { Button } from '../../components/Button';
import { FormTextInput } from '../../components/FormTextInput';
import { Checkbox } from '../../components/Checkbox';
import type { MockContact } from '../../types';
import type { MainTabParamList } from '../../navigation/types';

const TAGS = ['VIP', 'New', 'Loyal'];

export const ContactsScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const [query, setQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isImporting, setIsImporting] = React.useState(false);
  const [wizardStep, setWizardStep] = React.useState(0);
  const [editContact, setEditContact] = React.useState<MockContact | null>(null);
  const queryClient = useQueryClient();

  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactsApi.searchContacts({}),
  });

  const filteredContacts = React.useMemo(() => {
    return (contacts ?? []).filter((contact) => {
      const matchesQuery = !query || contact.name.toLowerCase().includes(query.toLowerCase()) || contact.phone.includes(query);
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => contact.tags.includes(tag));
      return matchesQuery && matchesTags;
    });
  }, [contacts, query, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const closeWizard = () => {
    setIsImporting(false);
    setWizardStep(0);
  };

  const runImport = async () => {
    const rows: MockContact[] = Array.from({ length: 5 }).map((_, index) => ({
      id: `import-${index}`,
      name: `Imported ${index + 1}`,
      phone: `+21266123${index.toString().padStart(3, '0')}`,
      tags: ['New'],
    }));
    await contactsApi.importContacts({ rows });
    await queryClient.invalidateQueries({ queryKey: ['contacts'] });
    setWizardStep(3);
  };

  const saveContact = async () => {
    if (!editContact) return;
    await contactsApi.updateContact(editContact);
    await queryClient.invalidateQueries({ queryKey: ['contacts'] });
    setEditContact(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppBar title="Contacts" trailing={<Button title="Import CSV" variant="outline" onPress={() => setIsImporting(true)} />} />
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search contacts"
          placeholderTextColor={theme.colors.muted}
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        />
      </View>
      <ScrollView horizontal contentContainerStyle={styles.tagRow} showsHorizontalScrollIndicator={false}>
        {TAGS.map((tag) => (
          <Chip key={tag} label={tag} selected={selectedTags.includes(tag)} onPress={() => toggleTag(tag)} />
        ))}
      </ScrollView>
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setEditContact(item)}
            style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <Checkbox label="" checked={selectedIds.includes(item.id)} onToggle={() => toggleSelect(item.id)} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ color: theme.colors.muted }}>{item.phone}</Text>
            </View>
            <Text style={{ color: theme.colors.muted }}>{item.tags.join(', ')}</Text>
          </Pressable>
        )}
      />
      <View style={styles.selectionBar}>
        <Text style={{ color: theme.colors.text }}>Selected: {selectedIds.length}</Text>
        <Button title="Create campaign" onPress={() => navigation.navigate('Marketing', { screen: 'CreateCampaign' } as any)} />
      </View>
      <Modal visible={isImporting} animationType="slide" onRequestClose={closeWizard}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}> 
          <Text style={[styles.title, { color: theme.colors.text }]}>Import contacts</Text>
          {wizardStep === 0 && (
            <>
              <Text style={{ color: theme.colors.muted }}>Upload your CSV to get started.</Text>
              <Button title="Select file (mock)" onPress={() => setWizardStep(1)} />
            </>
          )}
          {wizardStep === 1 && (
            <>
              <Text style={{ color: theme.colors.muted }}>Map your columns to contact fields.</Text>
              {['Name', 'Phone', 'Tags'].map((field) => (
                <Text key={field} style={{ color: theme.colors.text }}>{`Column matched: ${field}`}</Text>
              ))}
              <Button title="Continue" onPress={() => setWizardStep(2)} />
            </>
          )}
          {wizardStep === 2 && (
            <>
              <Text style={{ color: theme.colors.muted }}>Validation preview</Text>
              <Text style={{ color: theme.colors.text }}>No duplicates detected. 5 rows ready.</Text>
              <Button title="Import" onPress={runImport} />
            </>
          )}
          {wizardStep === 3 && (
            <>
              <Text style={{ color: theme.colors.muted }}>Import results</Text>
              <Text style={{ color: theme.colors.text }}>5 added, 0 skipped.</Text>
              <Button title="Download error CSV (mock)" variant="outline" onPress={() => {}} />
              <Button title="Done" onPress={closeWizard} />
            </>
          )}
          <Button title="Cancel" variant="ghost" onPress={closeWizard} />
        </View>
      </Modal>
      <Modal visible={!!editContact} animationType="slide" onRequestClose={() => setEditContact(null)}>
        {editContact && (
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}> 
            <Text style={[styles.title, { color: theme.colors.text }]}>Edit contact</Text>
            <FormTextInput label="Name" value={editContact.name} onChangeText={(value) => setEditContact({ ...editContact, name: value })} />
            <FormTextInput label="Phone" value={editContact.phone} onChangeText={(value) => setEditContact({ ...editContact, phone: value })} />
            <FormTextInput label="Tags" value={editContact.tags.join(', ')} onChangeText={(value) => setEditContact({ ...editContact, tags: value.split(',').map((item) => item.trim()) })} />
            <Button title="Save" onPress={saveContact} />
            <Button title="Close" variant="ghost" onPress={() => setEditContact(null)} />
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  tagRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  modalContent: {
    flex: 1,
    padding: 24,
    gap: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
});
