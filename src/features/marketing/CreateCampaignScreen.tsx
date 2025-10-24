import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MarketingStackParamList } from '../../navigation/types';
import { campaignsApi, contactsApi, templatesApi } from '../../services/api';
import { useOrg } from '../../hooks/useOrg';
import { useThemeContext } from '../../theme/ThemeProvider';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Checkbox } from '../../components/Checkbox';
import { FormTextInput } from '../../components/FormTextInput';
import { PhoneMockPreview } from '../../components/PhoneMockPreview';
import { DateTimePickerField } from '../../components/DateTimePickerField';
import { ModalSheet } from '../../components/ModalSheet';
import type { MockContact, MockTemplate } from '../../types';

export type CreateCampaignScreenProps = NativeStackScreenProps<MarketingStackParamList, 'CreateCampaign'>;

const steps = ['Template', 'Audience', 'Message', 'Schedule'];

export const CreateCampaignScreen: React.FC<CreateCampaignScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const queryClient = useQueryClient();
  const { data: templates } = useQuery({ queryKey: ['templates'], queryFn: templatesApi.listTemplates });
  const { data: contacts } = useQuery({ queryKey: ['contacts', '', ''], queryFn: () => contactsApi.searchContacts({}) });
  const { data: org } = useOrg();
  const [step, setStep] = React.useState(0);
  const [selectedTemplate, setSelectedTemplate] = React.useState<MockTemplate | null>(null);
  const [selectedContacts, setSelectedContacts] = React.useState<MockContact[]>([]);
  const [variables, setVariables] = React.useState<Record<string, string>>({});
  const [previewContact, setPreviewContact] = React.useState<MockContact | null>(null);
  const [scheduleDate, setScheduleDate] = React.useState<Date>(new Date());
  const [scheduleTime, setScheduleTime] = React.useState<Date>(new Date());
  const [sendNow, setSendNow] = React.useState(true);
  const [showSandboxModal, setShowSandboxModal] = React.useState(false);

  const mutation = useMutation({
    mutationFn: campaignsApi.sendCampaign,
    onSuccess: async (campaign) => {
      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      navigation.navigate('CampaignSuccess', { id: campaign.id });
    },
  });

  const toggleContact = (contact: MockContact) => {
    setSelectedContacts((prev) =>
      prev.find((item) => item.id === contact.id)
        ? prev.filter((item) => item.id !== contact.id)
        : [...prev, contact]
    );
  };

  React.useEffect(() => {
    if (selectedContacts.length > 0 && !previewContact) {
      setPreviewContact(selectedContacts[0]);
    }
  }, [selectedContacts, previewContact]);

  const canContinue = () => {
    switch (step) {
      case 0:
        return !!selectedTemplate;
      case 1:
        return selectedContacts.length > 0;
      case 2:
        return Object.values(variables).every((value) => value?.length);
      default:
        return true;
    }
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <FlatList
          data={templates ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <Card>
              <Text style={[styles.title, { color: theme.colors.text }]}>{item.name}</Text>
              <Text style={{ color: theme.colors.muted }}>Type: {item.type}</Text>
              <Text style={{ color: theme.colors.muted }}>Language: {item.language}</Text>
              <Text style={{ color: theme.colors.muted }}>Variables: {item.variables.join(', ')}</Text>
              <Button
                title={selectedTemplate?.id === item.id ? 'Selected' : 'Select'}
                onPress={() => {
                  setSelectedTemplate(item);
                  const initialVars = Object.fromEntries(item.variables.map((variable) => [variable, '']));
                  setVariables(initialVars);
                }}
              />
            </Card>
          )}
        />
      );
    }

    if (step === 1) {
      return (
        <FlatList
          data={contacts ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <Checkbox label="" checked={selectedContacts.some((contact) => contact.id === item.id)} onToggle={() => toggleContact(item)} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{item.name}</Text>
                  <Text style={{ color: theme.colors.muted }}>{item.phone}</Text>
                </View>
                <Chip label={item.tags[0]} />
              </View>
            </Card>
          )}
          ListFooterComponent={<Button title="Upload CSV" variant="outline" onPress={() => setStep(1)} />}
        />
      );
    }

    if (step === 2 && selectedTemplate) {
      return (
        <View style={{ gap: 16 }}>
          {selectedTemplate.variables.map((variable) => (
            <FormTextInput
              key={variable}
              label={variable.replace(/[{}]/g, '')}
              value={variables[variable] ?? ''}
              onChangeText={(value) => setVariables((prev) => ({ ...prev, [variable]: value }))}
            />
          ))}
          <Text style={{ color: theme.colors.muted }}>Preview as</Text>
          <View style={styles.previewRow}>
            {selectedContacts.slice(0, 5).map((contact) => (
              <Chip
                key={contact.id}
                label={contact.name}
                selected={previewContact?.id === contact.id}
                onPress={() => setPreviewContact(contact)}
              />
            ))}
          </View>
          <PhoneMockPreview
            header={previewContact?.name}
            message={`Hello ${previewContact?.name ?? 'Customer'}, ${selectedTemplate.name} ` +
              selectedTemplate.variables
                .map((variable) => `${variable.replace(/[{}]/g, '')}: ${variables[variable] ?? '___'}`)
                .join(' · ') }
          />
        </View>
      );
    }

    const scheduledDateTime = new Date(
      scheduleDate.getFullYear(),
      scheduleDate.getMonth(),
      scheduleDate.getDate(),
      scheduleTime.getHours(),
      scheduleTime.getMinutes()
    );

    return (
      <View style={{ gap: 16 }}>
        <View style={styles.rowBetween}>
          <Chip label="Send now" selected={sendNow} onPress={() => setSendNow(true)} />
          <Chip label="Schedule" selected={!sendNow} onPress={() => setSendNow(false)} />
        </View>
        {!sendNow && (
          <>
            <DateTimePickerField label="Date" value={scheduleDate} mode="date" onChange={setScheduleDate} />
            <DateTimePickerField label="Time" value={scheduleTime} mode="time" onChange={setScheduleTime} />
            <Text style={{ color: theme.colors.muted }}>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</Text>
          </>
        )}
        <Card>
          <Text style={[styles.title, { color: theme.colors.text }]}>Review</Text>
          <Text style={{ color: theme.colors.muted }}>Template: {selectedTemplate?.name}</Text>
          <Text style={{ color: theme.colors.muted }}>Audience: {selectedContacts.length} contacts</Text>
          <Text style={{ color: theme.colors.muted }}>Schedule: {sendNow ? 'Send immediately via sandbox' : scheduledDateTime.toLocaleString()}</Text>
        </Card>
        <Button
          title="Send campaign"
          onPress={() => {
            if (org?.wabaStatus !== 'active') {
              setShowSandboxModal(true);
              return;
            }
            submitCampaign(sendNow ? undefined : scheduledDateTime.toISOString());
          }}
          loading={mutation.isPending}
        />
      </View>
    );
  };

  const submitCampaign = (schedule?: string) => {
    if (!selectedTemplate) return;
    mutation.mutate({
      name: `${selectedTemplate.name} Blast`,
      templateId: selectedTemplate.id,
      schedule,
      selectedContacts: selectedContacts.map((contact) => contact.id),
      variables,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}>
      <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: 16 }}>Step {step + 1} of {steps.length} · {steps[step]}</Text>
      <View style={{ flex: 1, marginTop: 16 }}>{renderStep()}</View>
      <View style={styles.footer}>
        <Button title="Back" variant="ghost" onPress={() => setStep((value) => Math.max(value - 1, 0))} disabled={step === 0} />
        <Button
          title={step === steps.length - 1 ? 'Send campaign' : 'Next'}
          onPress={() => {
            if (step === steps.length - 1) {
              const scheduledDateTime = new Date(
                scheduleDate.getFullYear(),
                scheduleDate.getMonth(),
                scheduleDate.getDate(),
                scheduleTime.getHours(),
                scheduleTime.getMinutes()
              );
              if (org?.wabaStatus !== 'active') {
                setShowSandboxModal(true);
                return;
              }
              submitCampaign(sendNow ? undefined : scheduledDateTime.toISOString());
            } else {
              setStep((value) => value + 1);
            }
          }}
          disabled={!canContinue()}
          loading={mutation.isPending}
        />
      </View>
      <ModalSheet
        visible={showSandboxModal}
        onDismiss={() => setShowSandboxModal(false)}
        title="Connect WhatsApp Business"
        description="Your account is not yet verified. Send through the sandbox or connect a verified number."
        primaryAction={{
          label: 'Send via sandbox',
          onPress: () => {
            setShowSandboxModal(false);
            const scheduledDateTime = new Date(
              scheduleDate.getFullYear(),
              scheduleDate.getMonth(),
              scheduleDate.getDate(),
              scheduleTime.getHours(),
              scheduleTime.getMinutes()
            );
            submitCampaign(sendNow ? undefined : scheduledDateTime.toISOString());
          },
        }}
        secondaryAction={{ label: 'Cancel', onPress: () => setShowSandboxModal(false) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 16,
  },
});
