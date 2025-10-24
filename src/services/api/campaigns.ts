import { apiClient } from './client';
import type { MockCampaign } from '../../types';

export const listCampaigns = async () => {
  const { data } = await apiClient.get<{ campaigns: MockCampaign[] }>('/campaigns');
  return data.campaigns;
};

export const getCampaign = async (id: string) => {
  const { data } = await apiClient.get<{ campaign: MockCampaign | undefined }>(`/campaigns/${id}`);
  return data.campaign;
};

export const sendCampaign = async (payload: {
  name: string;
  templateId: string;
  schedule?: string;
  selectedContacts: string[];
  variables: Record<string, string>;
}) => {
  const { data } = await apiClient.post<{ campaign: MockCampaign }>('/campaigns/send', payload);
  return data.campaign;
};

export const getCampaignStats = async (payload: { id: string }) => {
  const { data } = await apiClient.post<{ stats: MockCampaign['stats']; timeline: MockCampaign['timeline'] }>('/campaigns/stats', payload);
  return data;
};

export const duplicateCampaign = async (payload: { id: string }) => {
  const { data } = await apiClient.post<{ campaign: MockCampaign | null }>('/campaigns/duplicate', payload);
  return data.campaign;
};

export const exportCampaign = async (payload: { id: string; format: 'csv' | 'pdf' }) => {
  const { data } = await apiClient.post<{ url: string }>('/campaigns/export', payload);
  return data.url;
};
