import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/api';

export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: authApi.fetchMe,
  });
