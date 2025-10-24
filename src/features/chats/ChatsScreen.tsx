import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../services/api';
import { useThemeContext } from '../../theme/ThemeProvider';
import { AppBar } from '../../components/AppBar';
import type { MockConversation, MockConversationMessage } from '../../types';
import { Chip } from '../../components/Chip';
import { Button } from '../../components/Button';

const FILTERS = ['All', 'Unread', 'Groups'] as const;

type FilterKey = (typeof FILTERS)[number];

export const ChatsScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const queryClient = useQueryClient();
  const [filter, setFilter] = React.useState<FilterKey>('All');
  const [openConversation, setOpenConversation] = React.useState<MockConversation | null>(null);
  const [messageBody, setMessageBody] = React.useState('');

  const { data: conversations } = useQuery({ queryKey: ['conversations'], queryFn: messagingApi.listConversations });

  const filteredConversations = conversations?.filter((conversation) => {
    if (filter === 'Unread') {
      return (conversation.unread ?? 0) > 0;
    }
    if (filter === 'Groups') {
      return conversation.type === 'group';
    }
    return true;
  });

  const { data: conversationDetails } = useQuery({
    queryKey: ['conversation', openConversation?.id],
    enabled: !!openConversation,
    queryFn: () => messagingApi.getConversation(openConversation!.id),
  });

  const mutateSend = useMutation({
    mutationFn: messagingApi.sendMessage,
    onSuccess: (message) => {
      if (!openConversation) return;
      queryClient.setQueryData(['conversation', openConversation.id], (current?: MockConversation) => {
        if (!current) return current;
        return { ...current, messages: [...current.messages, message] };
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      simulateStatus(message);
    },
  });

  const simulateStatus = (message: MockConversationMessage) => {
    if (!openConversation) return;
    const conversationId = openConversation.id;
    setTimeout(() => updateStatus(conversationId, message.id, 'sent'), 500);
    setTimeout(() => updateStatus(conversationId, message.id, 'delivered'), 1500);
    setTimeout(() => updateStatus(conversationId, message.id, 'read'), 3000);
  };

  const updateStatus = (conversationId: string, messageId: string, status: MockConversationMessage['status']) => {
    queryClient.setQueryData(['conversation', conversationId], (current?: MockConversation) => {
      if (!current) return current;
      return {
        ...current,
        messages: current.messages.map((item) => (item.id === messageId ? { ...item, status } : item)),
      };
    });
  };

  const sendMessage = () => {
    if (!openConversation || !messageBody.trim()) return;
    mutateSend.mutate({ conversationId: openConversation.id, body: messageBody.trim() });
    setMessageBody('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppBar title="Chats" />
      <View style={styles.filterRow}>
        {FILTERS.map((item) => (
          <Chip key={item} label={item} selected={filter === item} onPress={() => setFilter(item)} />
        ))}
      </View>
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.conversationRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => setOpenConversation(item)}
          >
            <View style={styles.avatar}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{item.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ color: theme.colors.muted }} numberOfLines={1}>
                {item.messages[item.messages.length - 1]?.body}
              </Text>
            </View>
            {item.unread ? (
              <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}> 
                <Text style={{ color: '#fff', fontSize: 12 }}>{item.unread}</Text>
              </View>
            ) : null}
          </Pressable>
        )}
      />
      <Modal visible={!!openConversation} animationType="slide" onRequestClose={() => setOpenConversation(null)}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <AppBar title={openConversation?.name ?? ''} trailing={<Button title="Close" variant="ghost" onPress={() => setOpenConversation(null)} />} />
          <FlatList
            data={conversationDetails?.messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  {
                    alignSelf: item.authorId === 'u1' ? 'flex-end' : 'flex-start',
                    backgroundColor: item.authorId === 'u1' ? theme.colors.primary : theme.colors.surface,
                  },
                ]}
              >
                <Text style={{ color: item.authorId === 'u1' ? '#fff' : theme.colors.text }}>{item.body}</Text>
                <Text style={{ color: item.authorId === 'u1' ? '#fff' : theme.colors.muted, fontSize: 12 }}>{item.status}</Text>
              </View>
            )}
          />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.composer, { borderTopColor: theme.colors.border }]}> 
              <Button
                title="Attach"
                variant="outline"
                onPress={() => setMessageBody((value) => `${value} [image attached]`)}
              />
              <TextInput
                placeholder="Type a message"
                placeholderTextColor={theme.colors.muted}
                style={[styles.input, { color: theme.colors.text }]}
                value={messageBody}
                onChangeText={setMessageBody}
              />
              <Button title="Send" onPress={sendMessage} loading={mutateSend.isPending} />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CA64C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
    gap: 4,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
