import { apiClient } from './client';

export const listNotifications = async () => {
  const { data } = await apiClient.get<{ notifications: any[] }>('/notifications');
  return data.notifications;
};

export const markNotificationsRead = async () => {
  const { data } = await apiClient.post<{ notifications: any[] }>('/notifications/markRead', {});
  return data.notifications;
};
