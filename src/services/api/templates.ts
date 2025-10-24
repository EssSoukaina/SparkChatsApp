import { apiClient } from './client';
import type { MockTemplate } from '../../types';

export const listTemplates = async () => {
  const { data } = await apiClient.get<{ templates: MockTemplate[] }>('/templates');
  return data.templates;
};

export const getTemplate = async (id: string) => {
  const { data } = await apiClient.get<{ template: MockTemplate }>(`/templates/${id}`);
  return data.template;
};
