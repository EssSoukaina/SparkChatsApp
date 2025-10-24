import { apiClient } from './client';

export const fetchSubscription = async () => {
  const { data } = await apiClient.get<{ plan: string; subscribed: boolean }>('/subscriptions');
  return data;
};

export const checkoutSubscription = async (payload: { plan: 'monthly' | 'yearly' }) => {
  const { data } = await apiClient.post<{ plan: string; subscribed: boolean }>('/subscriptions/checkout', payload);
  return data;
};
