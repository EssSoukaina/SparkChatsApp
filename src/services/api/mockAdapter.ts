import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios';
import { mockApi } from '../../mocks/mockApi';

type Handler = (config: AxiosRequestConfig) => Promise<AxiosResponse>;

const createResponse = (config: AxiosRequestConfig, data: any): AxiosResponse => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
});

const adapter: AxiosAdapter = async (config) => {
  const { url = '', method = 'get' } = config;
  const data = await mockApi.handle(method.toLowerCase(), url, config);
  return createResponse(config, data);
};

export const mockAdapter = adapter;
