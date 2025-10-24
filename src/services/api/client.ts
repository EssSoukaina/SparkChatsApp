import axios from 'axios';
import { resolveToken } from './token';
import { mockAdapter } from './mockAdapter';

export const apiClient = axios.create({
  baseURL: 'https://mock.sparkchats.app',
  adapter: mockAdapter,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await resolveToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
