import { apiClient } from './client';
import type { MockOrg, MockUser } from '../../types';

export const signup = async (payload: { name: string; email: string; password: string }) => {
  const { data } = await apiClient.post<{ user: MockUser }>('/auth/signup', payload);
  return data.user;
};

export const login = async (payload: { email: string; password: string }) => {
  const { data } = await apiClient.post<{ user: MockUser }>('/auth/login', payload);
  return data.user;
};

export const verifyEmail = async (payload: { code: string }) => {
  const { data } = await apiClient.post<{ success: boolean }>('/auth/verifyEmail', payload);
  return data.success;
};

export const forgotPassword = async (payload: { email: string }) => {
  const { data } = await apiClient.post<{ success: boolean }>('/auth/forgot', payload);
  return data.success;
};

export const resetPassword = async (payload: { email: string; password: string; code: string }) => {
  const { data } = await apiClient.post<{ success: boolean }>('/auth/reset', payload);
  return data.success;
};

export const changeEmail = async (payload: { email: string }) => {
  const { data } = await apiClient.post<{ user: MockUser }>('/auth/changeEmail', payload);
  return data.user;
};

export const fetchMe = async () => {
  const { data } = await apiClient.get<{ user: MockUser; org: MockOrg }>('/auth/me');
  return data;
};
