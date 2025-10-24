import { apiClient } from './client';
import type { MockConversation, MockConversationMessage } from '../../types';

export const listConversations = async () => {
  const { data } = await apiClient.get<{ conversations: MockConversation[] }>('/messaging/list');
  return data.conversations;
};

export const getConversation = async (id: string) => {
  const { data } = await apiClient.get<{ conversation: MockConversation | undefined }>(`/messaging/conversation/${id}`);
  return data.conversation;
};

export const sendMessage = async (payload: { conversationId: string; body: string; mediaUrl?: string }) => {
  const { data } = await apiClient.post<{ message: MockConversationMessage }>('/messaging/send', payload);
  return data.message;
};
