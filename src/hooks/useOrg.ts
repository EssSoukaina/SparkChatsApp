import { useQuery } from '@tanstack/react-query';
import { orgApi } from '../services/api';

export const useOrg = () =>
  useQuery({
    queryKey: ['org'],
    queryFn: orgApi.fetchOrg,
  });
