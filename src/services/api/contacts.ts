import { apiClient } from './client';
import type { MockContact } from '../../types';

export const searchContacts = async (payload: { query?: string; tags?: string[] }) => {
  const { data } = await apiClient.post<{ contacts: MockContact[] }>('/contacts', payload);
  return data.contacts;
};

export const updateContact = async (payload: Partial<MockContact> & { id: string }) => {
  const { data } = await apiClient.post<{ contact: MockContact }>('/contacts/update', payload);
  return data.contact;
};

export const importContacts = async (payload: { rows: MockContact[] }) => {
  const { data } = await apiClient.post<{
    added: number;
    skipped: number;
    updated: number;
    errors: { contact: MockContact; reason: string }[];
  }>('/contacts/import', payload);
  return data;
};
