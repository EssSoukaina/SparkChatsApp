import { apiClient } from './client';
import type { MockOrg } from '../../types';

export const fetchOrg = async () => {
  const { data } = await apiClient.get<{ org: MockOrg }>('/org');
  return data.org;
};

export const updateOrg = async (payload: Partial<MockOrg>) => {
  const { data } = await apiClient.post<{ org: MockOrg }>('/org/update', payload);
  return data.org;
};
